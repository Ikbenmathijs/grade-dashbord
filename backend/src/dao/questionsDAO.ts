import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import Test from "../interfaces/Test/test";
import Question from "../interfaces/Test/question";


let questions: Collection<Question>;

/**
 * Data Access Object for questions. This code interacts directly with the database.
 */
export default class QuestionsDao {
    /**
     * This function is called when the server starts.
     * It passes the connection over to this class so it can be used to interact with the database.
     * @param conn MongoDB connection
     * @returns 
     */
    static async injectDB(conn: MongoClient) {
        if (questions) {
            return;
        }
        try {
            questions = await conn.db(process.env.DB_NAME).collection("questions");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in questionsDAO: ${e}`);
        }
    }

    static async getQuestionById(id: ObjectId) {
        try {
            return await questions.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get question: ${e}`);
            return null;
        }
    }


    static async updateQuestionById(id: ObjectId, question: Question) {
        try {
            return await questions.updateOne({_id: id}, {$set: question});
        } catch (e) {
            log(LogLevel.Debug, `Unable to update question: ${e}`);
            return null;
        }
    }

    static async insertQuestion(question: Question) {
        try {
            const result = await questions.insertOne(question);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create question: ${e}`);
            return null;
        }
    }

    static async getQuestionByTestIdAndQuestionNumber(testId: ObjectId, questionNumber: number) {
        try {
            return await questions.findOne({test: testId, questionNumber: questionNumber});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get question: ${e}`);
            return null;
        }
    }
}