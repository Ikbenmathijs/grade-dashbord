import { Request, Response, NextFunction } from "express";
import { getValidSession } from "./auth";
import usersDao from "../dao/usersDAO";
import { importSpreadsheet } from "../sheetImporter/readSheet";




export default async function apiImportSheet(req: Request, res: Response, next: NextFunction) {

    const sessionCookie = req.cookies["Session"];

    if (!sessionCookie) {
        res.status(401).json({error: "Je bent niet ingelogd"});
        return;
    }

    const session = await getValidSession(sessionCookie);
    if (!session) {
        res.status(401).json({error: "Je sessie is verlopen of bestaat niet"});
        return;
    }

    const user = await usersDao.getUserById(session.userId);
    if (!user) {
        res.status(500).json({error: "Niet gelukt om gebruiker te vinden"});
        return;
    }
    
    if (!user.isAdmin) {
        res.status(401).json({error: "Je hebt geen toegang tot deze pagina want je bent geen admin"});
        return;
    }

    const file = req.file;

    if (!file) {
        res.status(400).json({error: "Er is geen bestand geupload"});
        return;
    }

    try {
        await importSpreadsheet();
    } catch (e) {
        res.status(400).json({error: `${e}`});
        return;
    }


    res.status(200).json({message: "Het bestand is geupload"});
}