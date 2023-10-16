import { OAuth2Client, TokenPayload } from 'google-auth-library';
import {Request, Response, NextFunction} from "express";
import usersDao from '../dao/usersDAO';
import User from '../interfaces/user';
import ApiFuncError from '../interfaces/apiFuncError';
import { ObjectId, UUID } from 'mongodb';
import Session from '../interfaces/session';
import { v4 as uuidv4 } from 'uuid';
import SessionsDAO from '../dao/sessionsDAO';


const client = new OAuth2Client(process.env.CLIENT_ID);


export async function apiLoginUser(req: Request, res: Response, next: NextFunction) {

    const verify = await verifyGoogleToken(req.body.token);

    // check if google token is valid
    if (!verify.valid) {
        res.status(401).json({error: "Google token bestaat niet of is verlopen"});
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
    console.log(new Date(verify.payload.exp * 1000).toLocaleString());
    

    // makes user valid 
    if (!user) {
        res.status(500).json({error: "Niet gelukt om gebruiker te maken of te vinden"});
        return;
    };


    // create session
    let session: Session = {
        _id: new UUID(uuidv4()),
        userId: user._id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    const session_id = await SessionsDAO.createSession(session);

    if (!session_id) {
        res.status(500).json({error: "Niet gelukt om sessie te maken"});
        return;
    }

    // send cookie
    res.cookie("Session", session_id, {
        secure: process.env.ENV !== "dev",
        httpOnly: true,
        expires: session.expires
    });

    res.status(200).json(user);
}


export async function apiVerifySession(req: Request, res: Response, next: NextFunction) {

    let sessionCookie = req.cookies["Session"];

    if (!sessionCookie) {
        res.status(401).json({error: "Je bent niet ingelogd"});
        return;
    }

    if (!verifySession(sessionCookie)) {
        res.status(401).json({error: "Je sessie is verlopen of bestaat niet"});
        return;
    }

    res.status(200).json();
}


export async function apiLogoutUser(req: Request, res: Response, next: NextFunction) {


    let sessionCookie = req.cookies["Session"];

    if (!sessionCookie) {
        res.status(401).json({error: "Je was al uitgelogd (er was geen sessie cookie gevonden)"});
        return;
    }

    if (!verifySession(sessionCookie)) {
        res.status(401).json({error: "Je was al uitgelogd (je sessie was verlopen of bestond niet)"});
        return;
    }

    const result = await SessionsDAO.deleteSession(new UUID(sessionCookie));

    if (!result) {
        res.status(500).json({error: "Niet gelukt om sessie te verwijderen"});
        return;
    }

    res.clearCookie("Session");

    res.status(200).json();
}



async function registerUser(google_payload: TokenPayload) {

    if (!google_payload.email) {
        let err: ApiFuncError = {
            message: "Er is geen email op je google-account gevonden.",
            code: 400
        }
        throw err;
    }

    if (!google_payload.email.endsWith("@fiorettileerling.nl") || 
        !google_payload.email.endsWith("@fioretti.nl") || 
        !google_payload.email.endsWith("@sft-vo.nl")) {

        let err: ApiFuncError = {
            message: "Je moet je school-email gebruiken om in te loggen.",
            code: 403
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


async function verifyGoogleToken(token: string) {

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


async function verifySession(token: string) {

    const session = await SessionsDAO.getSessionById(new UUID(token));

    if (!session) return false;

    if (session.expires < new Date()) return false;

    return true;
}