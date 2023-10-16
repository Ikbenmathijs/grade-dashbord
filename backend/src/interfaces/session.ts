import { ObjectId, UUID } from "mongodb";

export default interface Session {
    _id: UUID,
    userId: ObjectId,
    expires: Date
}