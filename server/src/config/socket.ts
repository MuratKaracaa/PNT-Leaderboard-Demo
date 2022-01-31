import { Server, Socket, ServerOptions } from "socket.io";
import { config } from "dotenv";
import cron, { Job } from "node-schedule";

import { cronExpressions, redisConstants, socketConstants } from "../constants";
import { redisFunctions, socketFunctions } from "../utils";
import { server as httpServer } from ".";

config();

export const socketServerOptions = {
  cors: {
    origin: "*",
  },
} as ServerOptions;

const io = new Server(httpServer, socketServerOptions);

// Exporting a method which sets up event listeners for the socket and returns it, to be used in the index.ts file

export default () => {
  io.on(socketConstants.onConnection, (socket: Socket) => {
    let client: Job;
    let tokenToUse: string;
    console.log("bağlantı alındı");

    // write the data coming from seeder to the stream
    socket.on(
      socketConstants.onDataFlowToRedisStream,
      async ([id, money]: [string, number]) => {
        await redisFunctions.appendToStream(
          redisConstants.keyNames.moneyStream,
          id,
          money
        );
      }
    );

    // start data stream after client connects
    socket.on(
      socketConstants.onFetchLeaderboardData,
      async ({ uid, token }) => {
        client = uid;
        tokenToUse = token;
        // every client has a unique id generated in browser, to prevent unnecesary data flow via cron or set interval, make sure any previous jobs are cancelled
        cron.scheduledJobs[uid] && cron.cancelJob(uid);

        // emit on request and then start a 5 second interval stream
        const initialData = await socketFunctions.createDataToStream(
          tokenToUse
        );
        socket.emit(socketConstants.onFetchLeaderboardData, initialData);

        cron.scheduleJob(
          uid,
          cronExpressions.schedules.secondsDivisibleByFive,
          async () => {
            const dataToEmit = await socketFunctions.createDataToStream(
              tokenToUse
            );
            socket.emit(socketConstants.onFetchLeaderboardData, dataToEmit);
          }
        );
      }
    );

    socket.on("auth-change", () => {
      cron.cancelJob(client);
    });

    socket.on("page-refresh", () => {
      cron.cancelJob(client);
    });

    socket.on("window-closed", () => {
      cron.cancelJob(client);
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
      socket.disconnect();
      cron.cancelJob(client);
    });
  });

  return io;
};
