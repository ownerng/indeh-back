import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

const validateConfig = (): Config => {
    if (!process.env.DB_HOST) throw new Error('DB_HOST no definido en .env');
    if (!process.env.DB_PORT) throw new Error('DB_PORT no definido en .env');
    if (!process.env.DB_USER) throw new Error('DB_USER no definido en .env');
    if (!process.env.DB_PASSWORD) throw new Error('DB_PASSWORD no definido en .env');
    if (!process.env.DB_NAME) throw new Error('DB_NAME no definido en .env');

    return {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: parseInt(process.env.DB_PORT, 10),
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
    };
  };
  
  export const config: Config = validateConfig();