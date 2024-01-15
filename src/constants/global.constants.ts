import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export enum NODE_ENVS {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const ENV = {
  PORT: Number(process.env.PORT) || 8000,
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV ?? NODE_ENVS.PRODUCTION,
  MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL ?? '',
};
