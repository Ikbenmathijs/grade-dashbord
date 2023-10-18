import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import User from "../interfaces/user";
import log from "../logger";
import LogLevel from "../enums/logLevel";


let users: Collection<User>;

/**
 * Data Access Object for users. This code interacts directly with the database.
 */
export default class usersDao {
    /**
     * This function is called when the server starts.
     * It passes the connection over to this class so it can be used to interact with the database.
     * @param conn MongoDB connection
     * @returns 
     */
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

    /**
     * Gets a user by its ID.
     * @param id user ID
     * @returns user
     */
    static async getUserById(id: ObjectId) {
        try {
            return await users.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get user: ${e}`);
            return null;
        }
    }

    /**
     * Gets a user by its google ID
     * @param googleId google ID
     * @returns user
     */
    static async getUserByGoogleId(googleId: string) {
        try {
            return await users.findOne({googleId: googleId});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get user by google id: ${e}`);
            return null;
        }
    }


    /**
     * Creates a new user
     * @param user User object with all fields set (including ID)
     * @returns 
     */
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