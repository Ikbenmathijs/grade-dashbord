

export default interface User {
    _id: string,
    googleId: string,
    email: string,
    first_name: string | undefined,
    last_name: string | undefined,
    createdAt: Date
}

