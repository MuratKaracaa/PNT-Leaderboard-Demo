import Redis from "ioredis";
import { config } from "dotenv";

config();

const { REDIS_HOST, REDIS_PORT } = process.env;

const client = new Redis({ host: REDIS_HOST!, port: +REDIS_PORT! });

export default client;
