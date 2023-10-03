import express from 'express';
import apiLoginUser from './api/auth';

const router = express.Router();


router.route("/auth").post(apiLoginUser);


export default router;