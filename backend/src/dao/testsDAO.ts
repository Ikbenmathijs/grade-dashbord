import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import Test from "../interfaces/Test/test";


let tests: Collection<Test>;

/**
 * Data Access Object for tests. This code interacts directly with the database.
 */
export default class TestsDao {
    /**
     * This function is called when the server starts.
     * It passes the connection over to this class so it can be used to interact with the database.
     * @param conn MongoDB connection
     * @returns 
     */
    static async injectDB(conn: MongoClient) {
        if (tests) {
            return;
        }
        try {
            tests = await conn.db(process.env.DB_NAME).collection("tests");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in testsDAO: ${e}`);
        }
    }

    static async getTestById(id: ObjectId) {
        try {
            return await tests.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get test: ${e}`);
            return null;
        }
    }

    static async getTestByName(name: string) {
        try {
            return await tests.findOne({name: name});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get test: ${e}`);
            return null;
        }
    }

    static async updateTestById(id: ObjectId, test: Test) {
        try {
            return await tests.updateOne({_id: id}, {$set: test});
        } catch (e) {
            log(LogLevel.Debug, `Unable to update test: ${e}`);
            return null;
        }
    }

    static async insertTest(test: Test) {
        try {
            const result = await tests.insertOne(test);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create test: ${e}`);
            return null;
        }
    }
}