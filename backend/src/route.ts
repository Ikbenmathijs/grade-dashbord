import express from 'express';
import {apiLoginUser, apiVerifySession, apiLogoutUser} from './api/auth';

/**
 * This file contains all the routes for the API
 * It is imported in index.ts
 * It tells the server what function to run whenever a request is made on a certain path
 */

const router = express.Router();


router.route("/auth/login").post(apiLoginUser);

router.route("/auth/verify").post(apiVerifySession);

router.route("/auth/logout").post(apiLogoutUser);


export default router;