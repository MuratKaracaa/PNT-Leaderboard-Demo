import { io } from "socket.io-client";

// socket instance

export default io(`${process.env.TARGET_DOMAIN}:${process.env.TARGET_PORT}`);
