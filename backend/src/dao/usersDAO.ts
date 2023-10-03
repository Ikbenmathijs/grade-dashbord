import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import User from "../interfaces/user";
import log from "../logger";
import LogLevel from "../enums/logLevel";


let users: Collection<User>;


export default class usersDao {
    static async injectDB(conn: MongoClient) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.DB_NAME).collection("users");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in userDAO: ${e}`);
        }
    }

    static async getUserById(id: ObjectId) {
        try {
            return await users.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get user: ${e}`);
            return null;
        }
    }

    static async getUserByGoogleId(googleId: string) {
        try {
            return await users.findOne({googleId: googleId});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get user by google id: ${e}`);
            return null;
        }
    }



    static async createUser(user: User) {
        try {
            const result = await users.insertOne(user);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create user: ${e}`);
            return null;
        }
    }
}