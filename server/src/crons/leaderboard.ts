import { redisFunctions, cronHelpers } from "../utils";

// Method to clear the leaderboard, distribute prizes and back up the total money of a user, which is persistently stored in a hash within redis
// The total money of a user can be accessed from the redis at all times, querying the database for that is slower
// Periodical back up of money info from redis is just good sense

export const resetLeaderboardAndDistributePrizes = async () => {
  const board = await redisFunctions.fetchFromLeaderBoardWithoutScores(0, 99);
  const poolMoney = await redisFunctions.getPrizePool();
  await cronHelpers.calculatePrizeBasedOnRanksAndDistribute(board, poolMoney);
  await redisFunctions.resetLeaderBoard();
};
