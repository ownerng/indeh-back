// src/infrastructure/database/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { PgAnexo } from './models/PgAnexo';
import { PgCalification } from './models/PgCalification';
import { PgStudent } from './models/PgStudent';
import { PgSubject } from './models/PgSubject';
import { PgUser } from './models/PgUser';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [PgAnexo, PgCalification, PgStudent, PgSubject, PgUser], 
  migrations: [],
  subscribers: [],
});