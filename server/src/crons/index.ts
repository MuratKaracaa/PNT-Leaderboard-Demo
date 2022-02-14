import cron from "node-cron";

import { resetLeaderboardAndDistributePrizes } from "./leaderboard";
import { cronExpressions } from "../constants";

cron.schedule(
  cronExpressions.schedules.hourlyReset,
  resetLeaderboardAndDistributePrizes
);
