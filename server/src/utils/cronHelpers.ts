import { redisFunctions } from ".";
import { redisConstants } from "../constants";
import { Player } from "../models";

// Mathematical logic behing the formula:
// We have a leaderboard with a length that is an even number. And the fixed percentages for the top players is an odd amount,
// which gives us a remaining number of players that is also odd.
// If we were to divide the remaining money among the rest of the players, we would simply take an average of remaining money/remaining players. However, the higher ranking
// remaining players should take more money. So we need to determine how much we need to increase/decrease the average, as the rank gets higher/lower.
// For example, the percentages for the last and the first of the remaining players will be equally more/less than the average, what they also have in common is their
// ranking difference from the player in the middle. So, we need to find a factor by which the average percentage will increase/decrease as their rank get higher/lower on the board.
// We can achieve that by dividing the average percentage by the number of players from either side of the board to the middle, including the middle one,
// because of the odd numbered remaining player number. => avgPercentage / halfOfRemainingBoard (Math.ceil(remaining board length / 2))
// Then we need to multiple that value by the substraction of each player's rank and the half length of the remaining board. => rank - halfOfRemainingBoard
// Finally, we need to substract that value from the average percentage, which, being the top of the remaining board is numerically the lowest, gives us the proportinal percentage
// based on rankings. The / 100 part is just circumstantial because the remaining percentage is given as 55 instead of 0.55.
// We multiply the percentage we get with the pool amount to get what each player's prize is.

const calculatePercentageBasedOnRank = (
  halfOfRemainingBoard: number,
  avgPercentage: number,
  rank: number
) => {
  return (
    (avgPercentage -
      (rank - halfOfRemainingBoard) * (avgPercentage / halfOfRemainingBoard)) /
    100
  );
};

// We loop through the board we get with method fetchFromTheLeaderBoardWithoutScores in the function where this functions is used. Each index points to an element in the board,
// which is an array, and plus one of each index points to the actual rank. Same result can be achieved with board.forEach((element, index)) as well, ranks again being plus one
// of the index. We utilise the switch-case syntax to specify the predetermined percentages for predetermined ranks with case {i} and with default we distribute prizes to
// the remaining players. the remainingPercentage, halfOfRemainingBoard and avgPercentage variables are same-named to avoid confusion when they are used in the
// calculatePercentageBasedOnRank function.

export const calculatePrizeBasedOnRanksAndDistribute = async (
  board: string[],
  poolMoney: number
) => {
  const remainingPercentage = 55;
  const halfOfRemainingBoard = Math.ceil((board.length - 3) / 2);
  const avgPercentage = remainingPercentage / (board.length - 3);
  for (let i = 0; i < board.length; i++) {
    const rank = i + 1;
    switch (rank) {
      case 1:
        await redisFunctions.incrementScoreInPlayerProfile(
          board[i],
          poolMoney * 0.2
        );
        break;
      case 2:
        await redisFunctions.incrementScoreInPlayerProfile(
          board[i],
          poolMoney * 0.15
        );
        break;
      case 3:
        await redisFunctions.incrementScoreInPlayerProfile(
          board[i],
          poolMoney * 0.1
        );
        break;
      default:
        await redisFunctions.incrementScoreInPlayerProfile(
          board[i],
          poolMoney *
            calculatePercentageBasedOnRank(
              halfOfRemainingBoard,
              avgPercentage,
              rank - 3
            )
        );
    }
  }
};

// A method that will run at the same time as leaderboard reset. As long as the server runs, the incoming money data is stored in the leaderboard as well as the player hash.
// The player hash is persistent for all time data access for performance reasons. But it's safe to periodically back that data up.
// The back up runs every predetermined minutes, slicing a predetermined part of db each time. Backup process for the whole database at a single time may put some heavy load on the
// server, and the back up does not have to happen immediately.

export const backUpMoneyOnDatabase = async () => {
  const players = await Player.find();

  for await (const player of players) {
    const [money] = await redisFunctions.getPlayerProfile(
      player._id,
      redisConstants.playerHashFields.money
    );
    money && (await player.update({ money: Math.round(+money) }));
  }
};
