import { config } from "dotenv";

import { server, io } from "./config";
import "./config";
import "./crons";
import { seeder, createMockDatabase, redisFunctions } from "./utils";
import { redisConstants } from "./constants";

config();

const { PORT } = process.env;
createMockDatabase().then(() => seeder());

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

io();
redisFunctions.continuousStreamRead({
  stream: redisConstants.keyNames.moneyStream,
});
