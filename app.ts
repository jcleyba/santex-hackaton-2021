import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { sequelize } from "./db";

dotenv.config();
const app: Application = express();

const port: number = Number(process.env.PORT) || 3001;

app.get("/ping", async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    res.send("pong");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.end(400);
  }
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
