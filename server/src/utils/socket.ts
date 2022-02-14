import { redisFunctions, helpers, mongoHelpers } from ".";

// This method is used to create the data object which will be streamed into the client with every second divisible by 5. A cron expression is used to implement that so that
// when two seperate windows are opened there will be data consistency.

export const createDataToStream = async (userToken: string | undefined) => {
  const id = userToken ? (await helpers.decodeToken(userToken)).sub : undefined;
  const userRank = id ? await redisFunctions.getPlayerRank(id) : null;
  const rankingBasedOnUser = userRank
    ? await redisFunctions.creteaBoardToEmit(userRank - 3, userRank + 2)
    : null;
  const rankingFirstHundred = await redisFunctions.creteaBoardToEmit(0, 99);
  const userProfile = id
    ? JSON.stringify(await mongoHelpers.getPlayerProfile(id))
    : null;
  return JSON.stringify({
    rankingBasedOnUser,
    rankingFirstHundred,
    userProfile,
  });
};
