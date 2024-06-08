import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  username: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "threads",
  synchronize: true,
  logging: false,
  entities: ["./src/entities/*.ts"],
  migrations: ["./src/migration/*.ts"],
  subscribers: [],
});
