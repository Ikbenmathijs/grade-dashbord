import express from 'express';
import apiLoginUser from './api/auth';
import {Request, Response, NextFunction} from "express";


const router = express.Router();


router.route("/auth").post(apiLoginUser);


export default router;