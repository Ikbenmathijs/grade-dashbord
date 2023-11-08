import express from 'express';
import {apiLoginUser, apiVerifySession, apiLogoutUser} from './api/auth';
import { importSpreadsheet } from './sheetImporter/readSheet';

/**
 * This file contains all the routes for the API
 * It is imported in index.ts
 * It tells the server what function to run whenever a request is made on a certain path
 */

const router = express.Router();


router.route("/auth/login").post(apiLoginUser);

router.route("/auth/verify").post(apiVerifySession);

router.route("/auth/logout").post(apiLogoutUser);

router.route("/sheets/import").post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await importSpreadsheet();
        res.status(200).json();
    } catch (e) {
        res.status(500).json({error: e});
        throw e;
    }
})

export default router;