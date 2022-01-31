import { io, Socket } from "socket.io-client";
import { config } from "dotenv";

import { Player } from "../models";
import { IPlayers } from "../typings";
import { socketConstants } from "../constants";

config();

// This method is in no way part of the back end logic. This is to stimulate a on-a-second-basis data flow to the server, getting random 1000 players from the database and
// sending it along with a random money value to be written to the data stream.

export default () => {
  const { PORT } = process.env;
  const seederSocket: Socket = io(`http://127.0.0.1:${PORT}`);
  setInterval(async () => {
    const randomBunch: IPlayers = await Player.aggregate([
      {
        $sample: { size: 1000 },
      },
      {
        $project: {
          _id: 1,
          userName: 0,
          name: 0,
          country: 0,
          money: 0,
          __v: 0,
        },
      },
    ]);

    randomBunch.forEach(({ _id }) => {
      const money: number = Math.floor(Math.random() * 1000);
      seederSocket.emit(socketConstants.onDataFlowToRedisStream, [_id, money]);
    });
  }, 1000);
};
