import { redisConstants } from "../constants";
import { client } from "../config";
import { helpers, mongoHelpers, redisFunctions } from ".";

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

export const setExistingRank = async (id: string, rank: number) => {
  await client.hmset(id, redisConstants.playerHashFields.eRank, rank);
};

export const getExistingRank = async (id: string) => {
  return await client.hmget(id, redisConstants.playerHashFields.eRank);
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
    const existingRank: number = (await getPlayerRank(userId)) + 1;

    await mongoHelpers.updatePlayerMoney(userId, money);

    await client
      .multi()
      .xdel(stream, readDataId)
      .zincrby(redisConstants.keyNames.leaderboard, money, userId)
      .hincrbyfloat(
        redisConstants.keyNames.prizePool,
        redisConstants.prizePoolFields.amount,
        money * 0.02
      )
      .hmset(userId, redisConstants.playerHashFields.eRank, existingRank)
      .exec();

    setTimeout(() => continuousStreamRead({ stream }), 0);
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
      const [eRank] = await getExistingRank(leaderboardInRedis[i]);
      const { name, country } = await mongoHelpers.getPlayerProfile(
        leaderboardInRedis[i]
      );
      const uRank =
        (await redisFunctions.getPlayerRank(leaderboardInRedis[i])) + 1;
      const money = leaderboardInRedis[i + 1];
      leaderboardToEmit.push(
        JSON.stringify([name, country, eRank, uRank, money])
      );
    }
    return leaderboardToEmit;
  } catch (error) {
    console.log(error);
  }
};
