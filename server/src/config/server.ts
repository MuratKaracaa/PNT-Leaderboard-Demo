import express from "express";
import { createServer } from "http";
import cors from "cors";

import router from "../routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
const httpServer = createServer(app);

export default httpServer;
