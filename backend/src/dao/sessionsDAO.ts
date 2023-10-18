import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import Session from "../interfaces/session";


let sessions: Collection<Session>;

/**
 * Data Access Object for sessions. This code interacts directly with the database.
 */
export default class SessionsDAO {
    /**
     * This function is called when the server starts.
     * It passes the connection over to this class so it can be used to interact with the database.
     * @param conn MongoDB connection
     * @returns 
     */
    static async injectDB(conn: MongoClient) {
        // check if already connected
        if (sessions) {
            return;
        }
        // try to access the sessions collection
        try {
            sessions = await conn.db(process.env.DB_NAME).collection("sessions");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in SessionsDAO: ${e}`);
        }
    }

    /**
     * Gets a session by its ID.
     * @param id Session ID
     * @returns Session
     */
    static async getSessionById(id: UUID) {
        try {
            return await sessions.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get session: ${e}`);
            return null;
        }
    }

    
    /**
     * Creates a new session
     * @param session Session object, all fields including the ID field must be set. Use UUIDv4 for secure IDs.
     * @returns ID of the new session (even though you already had it)
     */
    static async createSession(session: Session) {
        try {
            const result = await sessions.insertOne(session);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create session: ${e}`);
            return null;
        }
    }


    /**
     * Deletes a session by its ID.
     * @param id Session ID
     * @returns Number of deleted sessions
     */
    static async deleteSession(id: UUID) {
        try {
            const result = await sessions.deleteOne({_id: id});
            return result.deletedCount;
        } catch (e) {
            log(LogLevel.Debug, `Unable to delete session: ${e}`);
            return null;
        }
    }
    
}