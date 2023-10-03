import { ObjectId } from "mongodb"

export default interface User {
    _id: ObjectId,
    googleId: string,
    email: string,
    first_name: string | undefined,
    last_name: string | undefined,
    createdAt: Date
}

