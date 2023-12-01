import express from 'express';
import {apiLoginUser, apiVerifySession, apiLogoutUser} from './api/auth';
import { importSpreadsheet } from './sheetImporter/readSheet';
import { apiGetTestResults } from './api/testResults';
import apiImportSheet from './api/sheetImport';
import { upload } from './index';

/**
 * This file contains all the routes for the API
 * It is imported in index.ts
 * It tells the server what function to run whenever a request is made on a certain path
 */

export default function getRouter() {
    const router = express.Router();

    router.route("/auth/login").post(apiLoginUser);

    router.route("/auth/verify").post(apiVerifySession);

    router.route("/auth/logout").post(apiLogoutUser);

    router.route("/testResults").get(apiGetTestResults);

    router.route("/sheets/import").post(upload.single("sheet"), apiImportSheet);

    return router;
}





