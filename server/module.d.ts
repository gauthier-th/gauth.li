declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    CONNECTION_STRING: string;
    JWT_SECRET: string;
  }
}