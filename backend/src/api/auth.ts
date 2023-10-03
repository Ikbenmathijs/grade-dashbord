import { OAuth2Client, TokenPayload } from 'google-auth-library';
import {Request, Response, NextFunction} from "express";
import usersDao from '../dao/usersDAO';
import User from '../interfaces/user';
import ApiFuncError from '../interfaces/apiFuncError';
import { ObjectId } from 'mongodb';




const client = new OAuth2Client(process.env.CLIENT_ID);



export default async function apiLoginUser(req: Request, res: Response, next: NextFunction) {

    const verify = await verifyLogin(req.body.token);

    // check if google token is valid
    if (!verify.valid) {
        res.status(401).send("Unauthorised");
        return;
    }

    // for typescript to make sure it's not undefined
    if (!verify.payload) return;


    let user = await usersDao.getUserByGoogleId(verify.payload.sub);

    if (!user) {
        // register user
        try {
            user = await registerUser(verify.payload);

        } catch (e) {
            const err = e as ApiFuncError;
            res.status(err.code).json({error: err.message});
            return;
        }
    }

    res.status(200).json(user);
    


}

async function registerUser(google_payload: TokenPayload) {

    if (!google_payload.email) {
        let err: ApiFuncError = {
            message: "Missing email",
            code: 400
        }
        throw err;
    }


    const userObj: User = {
        _id: new ObjectId(),
        googleId: google_payload.sub,
        email: google_payload.email,
        first_name: google_payload.given_name,
        last_name: google_payload.family_name,
        createdAt: new Date()
    }

    const result = await usersDao.createUser(userObj);

    if (!result) {
        let err: ApiFuncError = {
            message: "Unable to create user",
            code: 500
        }
        throw err;
    }

    let user = await usersDao.getUserById(result);

    return user;
}


async function verifyLogin(token: string) {

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID as string
        });

        const payload = ticket.getPayload();

        return {valid: true, payload: payload};
    } catch(e) {
        return {valid: false, payload: undefined}
    }
}