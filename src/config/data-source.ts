import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { PgUser } from "../entities/PgUser";
import { PgStudent } from "../entities/PgStudent";
import { PgSubject } from "../entities/PgSubject";
import { PgScore } from "../entities/PgScore";
import { PgBoletin } from "../entities/PgBoletin";
import { PgCiclo } from "../entities/PgCiclo";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "00000",
  database: process.env.DB_DATABASE || "indehdb",
  synchronize: true, 
  logging: false, 
  entities: [PgUser, PgStudent, PgSubject, PgScore, PgBoletin, PgCiclo], 
  migrations: [],
  subscribers: [],
});