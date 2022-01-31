import { redisConstants } from "../constants";
import { client } from "../config";
import { helpers, redisFunctions } from ".";

// Until line 113, we have a bunch of functions with better suited names for the project, created by using the redis client. There is no extra logic
// in these functions, some even have the same parameters.
export const fetchFromLeaderBoard = async (start: number, end: number) => {
  return await client.zrevrange(
    redisConstants.keyNames.leaderboard,
    start,
    end,
    "WITHSCORES"
  );
};

export const fetchFromLeaderBoardWithoutScores = async (
  start: number,
  end: number
) => {
  return await client.zrevrange(
    redisConstants.keyNames.leaderboard,
    start,
    end
  );
};

export const getPlayerRank = async (id: string) => {
  return (await client.zrevrank(
    redisConstants.keyNames.leaderboard,
    id
  )) as number;
};

export const incrementScoreInLeaderBoard = async (
  id: string,
  money: number
) => {
  await client.zincrby(redisConstants.keyNames.leaderboard, money, id);
};

export const resetLeaderBoard = async () => {
  await client.del(redisConstants.keyNames.leaderboard);
};

export const setPlayerProfile = async (
  id: string,
  ...args: Array<string | number>
) => {
  await client.hmset(id, args);
};

export const getPlayerProfile = async (id: string, ...args: string[]) => {
  return await client.hmget(id, args);
};

export const incrementScoreInPlayerProfile = async (
  id: string,
  money: number
) => {
  await client.hincrbyfloat(id, redisConstants.playerHashFields.money, money);
};

export const createPrizePool = async () => {
  await client.hmset(
    redisConstants.keyNames.prizePool,
    redisConstants.prizePoolFields.amount,
    0
  );
};

export const getPrizePool = async () => {
  return +(await client.hmget(
    redisConstants.keyNames.prizePool,
    redisConstants.prizePoolFields.amount
  ));
};

export const incrementScoreInPrizePool = async (money: number) => {
  await client.hincrbyfloat(
    redisConstants.keyNames.prizePool,
    redisConstants.prizePoolFields.amount,
    money
  );
};

export const getStreamLength = async (stream: string) => {
  return await client.xlen(stream);
};

export const appendToStream = async (
  stream: string,
  ...args: Array<string | number>
) => {
  await client.xadd(stream, "*", args);
};

export const readFromTopOfStream = async (stream: string, count: number) => {
  return await client.xread(
    redisConstants.parameters.COUNT,
    count,
    redisConstants.parameters.STREAMS,
    stream,
    redisConstants.parameters.ID,
    "0-0",
    "$"
  );
};

export const deleteFromStream = async (stream: string, id: string) => {
  await client.xdel(stream, id);
};

// This function is used to read and process data from our stream, in which we have a lot of ObjectID, money pairs. The reason we first write those pairs into a stream first
// and then process it later is that foreach data we have more than 1 job to do. So when the redis server is carrying out those tasks more data can be received faster than
// those tasks are carried out, which may cause data loss. By this logic, we may have multiple instances carrying out the same tasks, implementing a sort of division of labor.

export const continuousStreamRead = async ({
  stream,
}: {
  stream: string;
}): Promise<void> => {
  try {
    const streamLength: number = await getStreamLength(
      redisConstants.keyNames.moneyStream
    );
    if (streamLength === 0) return continuousStreamRead({ stream });
    const readMessage = await readFromTopOfStream(stream, 1);
    const [readDataId, userId, money] =
      helpers.parseDataFromStream(readMessage);

    await deleteFromStream(stream, readDataId);
    await updateMoneyAndRankBasedOnDataFromStream(userId, +money);
    setTimeout(() => continuousStreamRead({ stream }), 0);
  } catch (error) {
    console.log(error);
  }
};

// This function is part of the data read from the stream processing. It basically takes the money value, increments the user's money on the leaderboard, which is reset
// periodically, on the player's hash, which is persistent and can be used to get the current money of the user, on the prizepool, which is the whole point of the project,
// and it also keeps track of the user's rank on the leaderboard BEFORE the incrementation, which we utilize while seeing if the user has gotten lower, higher on remained
// the same on the leaderboard. The downside of the approach is that without any activity, i.e. money earning, a player may lose rank but it may go unnoticed. Also,
// two dormant players may have the same eRank value, which may cause confusion. However, in a board of 10 million players, any sort of inactivity may cause the player
// to be out of the top 100, where we use the ranking difference value. So, to some extent, this downside may be overlooked.

export const updateMoneyAndRankBasedOnDataFromStream = async (
  userId: string,
  money: number
) => {
  try {
    const existingRank: number = (await getPlayerRank(userId)) + 1;
    await incrementScoreInLeaderBoard(userId, money);
    await incrementScoreInPlayerProfile(userId, money);
    await incrementScoreInPrizePool(money * 0.02);
    await setPlayerProfile(
      userId,
      redisConstants.playerHashFields.eRank,
      existingRank
    );
  } catch (error) {
    console.log(error);
  }
};

// This method is to create a sensible data for data read from the leaderboard when it's fetched with scores, also includes the player's related data to be used on the client

export const creteaBoardToEmit = async (start: number, end: number) => {
  try {
    const leaderboardInRedis = await fetchFromLeaderBoard(start, end);
    const leaderboardToEmit = [];
    for (let i = 0; i < leaderboardInRedis.length; i += 2) {
      const playerData = await getPlayerProfile(
        leaderboardInRedis[i],
        redisConstants.playerHashFields.name,
        redisConstants.playerHashFields.country,
        redisConstants.playerHashFields.eRank
      );
      const uRank =
        (await redisFunctions.getPlayerRank(leaderboardInRedis[i])) + 1;
      const money = leaderboardInRedis[i + 1];
      leaderboardToEmit.push(JSON.stringify([...playerData, uRank, money]));
    }
    return leaderboardToEmit;
  } catch (error) {
    console.log(error);
  }
};
