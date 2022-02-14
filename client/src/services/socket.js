import { io } from "socket.io-client";

// socket instance

export default io(
  `${process.env.REACT_APP_TARGET_DOMAIN}:${process.env.REACT_APP_TARGET_PORT}`
);
