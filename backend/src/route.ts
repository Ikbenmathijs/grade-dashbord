import express from 'express';
import {apiLoginUser, apiVerifySession, apiLogoutUser} from './api/auth';
import {Request, Response, NextFunction} from "express";


const router = express.Router();


router.route("/auth/login").post(apiLoginUser);

router.route("/auth/verify").post(apiVerifySession);

router.route("/auth/logout").post(apiLogoutUser);


export default router;