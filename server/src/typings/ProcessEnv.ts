// Global declarations for the environment variables "process.env"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      PORT: number;
      REDIS_MASTER_HOST: string;
      REDIS_MASTER_PORT: number;
      REDIS_SLAVE_1_HOST: string;
      REDIS_SLAVE_1_PORT: string;
      REDIS_SLAVE_2_HOST: string;
      REDIS_SLAVE_2_PORT: string;
      REDIS_SENTINEL_1_HOST: string;
      REDIS_SENTINEL_1_PORT: number;
      REDIS_SENTINEL_2_HOST: string;
      REDIS_SENTINEL_2_PORT: number;
      REDIS_SENTINEL_3_HOST: string;
      REDIS_SENTINEL_3_PORT: number;
      DB_STRING: string;
    }
  }
}

export {};
