import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Tag, SME, SmeTag } from "./models";

export const connectionOptions: SequelizeOptions = {
  host: process.env.DB_HOST || "",
  database: process.env.DB_NAME || "",
  dialect: "postgres",
  dialectOptions: {
    ssl: true,
  },
  username: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
};

export const sequelize = new Sequelize({
  ...connectionOptions,
  models: [SME, Tag, SmeTag],
});
