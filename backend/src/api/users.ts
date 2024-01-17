import { Request, Response, NextFunction } from "express";
import User from "../interfaces/user";
import usersDao from "../dao/usersDAO";
import { getUserFromSessionCookie } from "./auth";


export async function apiGetUsers(req: Request, res: Response, next: NextFunction) {

    const user = await getUserFromSessionCookie(req);

    if (!user) {
        res.status(401).json({error: "Je bent niet ingelogd"});
        return;
    }

    if (!user.isAdmin) {
        res.status(401).json({error: "Je bent geen admin"});
        return;
    }


    const users = await usersDao.getUsers();

    if (!users) {
        res.status(404).json({error: "No users found"});
        return;
    }

    res.json(users);
}