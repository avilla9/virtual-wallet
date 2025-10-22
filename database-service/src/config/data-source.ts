import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.entity.ts";
import { Wallet } from "../entities/Wallet.entity.ts";

const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT || "3306");
const DB_USERNAME = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

if (!DB_HOST || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
    console.error("Missing DB environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.");
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Wallet],
    migrations: [],
    subscribers: [],
});
