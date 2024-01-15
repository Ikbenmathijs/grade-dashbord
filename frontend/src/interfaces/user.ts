

export default interface User {
    _id: string,
    googleId: string,
    email: string,
    firstName: string | undefined,
    lastName: string | undefined,
    createdAt: Date,
    isAdmin: boolean,
}

