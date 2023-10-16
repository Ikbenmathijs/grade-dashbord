import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './route';
import { ServerApiVersion, MongoClient } from 'mongodb';
import log from './logger';
import LogLevel from './enums/logLevel';
import UsersDao from './dao/usersDAO';
import SessionsDAO from './dao/sessionsDAO';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());

app.use(cookieParser());


app.use("/api", router);

const client = new MongoClient(process.env.MONGO_DB_LOGIN as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


client.connect().catch((e) => {
  log(LogLevel.Error, `Unable to connect to database: ${e}`);
}).then(async client => {
  if (!client) {
    log(LogLevel.Error, `Unable to connect to database, client is void`);
    return;
  }

  
  app.listen(port, () => {
    UsersDao.injectDB(client);
    SessionsDAO.injectDB(client);
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});



