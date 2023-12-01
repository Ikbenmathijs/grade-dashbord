import { ObjectId } from "mongodb"

export default interface User {
    _id: ObjectId,
    googleId: string,
    email: string,
    firstName: string | undefined,
    lastName: string | undefined,
    createdAt: Date,
    isAdmin: boolean
}

