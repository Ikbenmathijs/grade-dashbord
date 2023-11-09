import { Request, Response, NextFunction } from "express";
import { getUserFromSessionCookie } from "./auth";
import QuestionsDao from "../dao/questionsDAO";
import TestsDao from "../dao/testsDAO";
import QuestionAnswersDao from "../dao/questionAnswersDAO";
import Test from "../interfaces/Test/test";
import Question from "../interfaces/Test/question";

async function getTestResults(req: Request, res: Response, next: NextFunction) {
    const user = await getUserFromSessionCookie(req);

    if (!user) {
        res.status(401).json({error: "Je bent niet ingelogd"});
        return;
    }

    const questionAnswers = await QuestionAnswersDao.getQuestionAnswersByEmail(user.email);

    if (!questionAnswers) {
        res.status(404).json({error: "Er zijn geen antwoorden gevonden voor deze gebruiker"});
        return;
    }

    let tests: Test[] = [];
    for (let i = 0; i < questionAnswers.length; i++) {
        if (tests.find(test => test._id.equals(questionAnswers[i].test))) {
            continue;
        }
        
    }

}