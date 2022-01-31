// Global declarations for the environment variables "process.env"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      PORT: number;
      REDIS_HOST: string;
      REDIS_PORT: number;
      DB_STRING: string;
    }
  }
}

export {};
