import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import QuestionAnswer from "../interfaces/Test/questionAnswer";

let questionsAnswers: Collection<QuestionAnswer>;

/**
 * Data Access Object for questions. This code interacts directly with the database.
 */
export default class QuestionAnswersDao {
    /**
     * This function is called when the server starts.
     * It passes the connection over to this class so it can be used to interact with the database.
     * @param conn MongoDB connection
     * @returns 
     */
    static async injectDB(conn: MongoClient) {
        if (questionsAnswers) {
            return;
        }
        try {
            questionsAnswers = await conn.db(process.env.DB_NAME).collection("questionAnswers");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in questionAnswersDAO: ${e}`);
        }
    }

    static async getQuestionAnswerById(id: ObjectId) {
        try {
            return await questionsAnswers.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get question answer: ${e}`);
            return null;
        }
    }


    static async updateQuestionAnswerById(id: ObjectId, questionAnswer: QuestionAnswer) {
        try {
            return await questionsAnswers.updateOne({_id: id}, {$set: questionAnswer});
        } catch (e) {
            log(LogLevel.Debug, `Unable to update question answer: ${e}`);
            return null;
        }
    }

    static async insertQuestionAnswer(question: QuestionAnswer) {
        try {
            const result = await questionsAnswers.insertOne(question);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create question answer: ${e}`);
            return null;
        }
    }

    static async getQuestionAnswerByTestIdAndQuestionNumberAndEmailAndVersion(testId: ObjectId, questionNumber: number, email: string, version:string) {
        try {
            return await questionsAnswers.findOne({test: testId, questionNumber: questionNumber, email: email, version: version});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get question answer: ${e}`);
            return null;
        }
    }

    static async getQuestionAnswersByEmail(email: string) {
        try {
            return await questionsAnswers.find({email: email}).toArray();
        } catch (e) {
            log(LogLevel.Debug, `Unable to get question answers: ${e}`);
            return null;
        }
    }


    static async deleteQuestionAnswersByTestId(testId: ObjectId) {
        try {
            return await questionsAnswers.deleteMany({test: testId});
        } catch (e) {
            log(LogLevel.Debug, `Unable to delete question answers: ${e}`);
            return null;
        }
    }
}