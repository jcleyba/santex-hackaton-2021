import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { smeRouterFactory, tagRouterFactory } from './routes';

dotenv.config();

import { sequelize } from './db';
(async () => {
  await sequelize.sync();
  const app: Application = express();

  const port: number = Number(process.env.PORT) || 3001;
  app.use(express.urlencoded()); //Parse URL-encoded bodies

  app.use(json());

  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });

  app.use(smeRouterFactory());
  app.use(tagRouterFactory());
})();
