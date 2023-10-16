import { MongoClient, Collection } from "mongodb";
import { ObjectId, UUID } from "bson";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import Session from "../interfaces/session";


let sessions: Collection<Session>;


export default class SessionsDAO {
    static async injectDB(conn: MongoClient) {
        if (sessions) {
            return;
        }
        try {
            sessions = await conn.db(process.env.DB_NAME).collection("sessions");
        } catch (e) {
            log(LogLevel.Error, `Unable to establish collection handles in SessionsDAO: ${e}`);
        }
    }


    static async getSessionById(id: UUID) {
        try {
            return await sessions.findOne({_id: id});
        } catch (e) {
            log(LogLevel.Debug, `Unable to get session: ${e}`);
            return null;
        }
    }

    static async createSession(session: Session) {
        try {
            const result = await sessions.insertOne(session);
            return result.insertedId;
        } catch (e) {
            log(LogLevel.Debug, `Unable to create session: ${e}`);
            return null;
        }
    }
}