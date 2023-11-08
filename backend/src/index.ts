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
import QuestionsDao from './dao/questionsDAO';
import TestsDao from './dao/testsDAO';
import QuestionAnswersDao from './dao/questionAnswersDAO';


/**
 * This file is the entry point of the backend. This is where the server is started.
 */


// load environment variables
dotenv.config();

// create express instance
const app: Express = express();
const port = process.env.PORT;

// Cross Origin Resource Sharing setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// This is needed to be able to read the request body and reply in json
app.use(express.json());

// This is needed to be able to read cookies
app.use(cookieParser());

// This assigns the routes from route.ts to the /api path
app.use("/api", router);


// This creates a MongoDB client instance
const client = new MongoClient(process.env.MONGO_DB_LOGIN as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// This connects to the database
client.connect().catch((e) => {
  log(LogLevel.Error, `Unable to connect to database: ${e}`);
}).then(async client => {
  // This runs when the database is connected

  // This checks if the client is valid (if not then something went wrong while connecting to the database)
  if (!client) {
    log(LogLevel.Error, `Unable to connect to database, client is void`);
    return;
  }

  // This starts the server on the specified port
  app.listen(port, () => {
    // This runs when the server is started

    // This injects the database connection into the DAOs
    UsersDao.injectDB(client);
    SessionsDAO.injectDB(client);
    QuestionsDao.injectDB(client);
    TestsDao.injectDB(client);
    QuestionAnswersDao.injectDB(client);
    

    
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});



