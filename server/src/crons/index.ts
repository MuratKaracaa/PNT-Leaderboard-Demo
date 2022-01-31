import cron from "node-cron";

import { resetLeaderboardDistributePrizesAndBackUpMoneyOnDatabase } from "./leaderboard";
import { cronExpressions } from "../constants";

cron.schedule(
  cronExpressions.schedules.hourlyReset,
  resetLeaderboardDistributePrizesAndBackUpMoneyOnDatabase
);
