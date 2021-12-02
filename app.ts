import express, { Application, Request, Response } from "express";
import { json } from 'body-parser';
import dotenv from "dotenv";
import { smeRouterFactory, tagRouterFactory } from './routes'

dotenv.config();

import { sequelize } from "./db";

(async () => {

  await sequelize.sync();
  
  const app: Application = express();

  const port: number = Number(process.env.PORT) || 3001;

  app.use(json());

  app.get("/ping", async (req: Request, res: Response) => {
    try {
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
  
  app.use(smeRouterFactory());
  app.use(tagRouterFactory());
})();
