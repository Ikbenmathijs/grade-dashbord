import express from 'express';
import {apiLoginUser, apiVerifySession} from './api/auth';
import {Request, Response, NextFunction} from "express";


const router = express.Router();


router.route("/auth").post(apiLoginUser);

router.route("/auth/verify").post(apiVerifySession);


export default router;