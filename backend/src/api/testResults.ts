import { Request, Response, NextFunction } from "express";
import { getUserFromSessionCookie } from "./auth";
import QuestionsDao from "../dao/questionsDAO";
import TestsDao from "../dao/testsDAO";
import QuestionAnswersDao from "../dao/questionAnswersDAO";
import Test from "../interfaces/Test/test";
import Question from "../interfaces/Test/question";
import log from "../logger";
import LogLevel from "../enums/logLevel";
import { TestResult, TestResultQuestion } from "../interfaces/testResult";
import usersDao from "../dao/usersDAO";
import { ObjectId } from "mongodb";

export async function apiGetTestResults(req: Request, res: Response, next: NextFunction) {
    let user = await getUserFromSessionCookie(req);

    if (!user) {
        res.status(401).json({error: "Je bent niet ingelogd"});
        return;
    }

    const questionAnswers = await QuestionAnswersDao.getQuestionAnswersByEmail(user.email);

    if (!questionAnswers) {
        res.status(404).json({error: "Er zijn geen antwoorden gevonden voor deze gebruiker"});
        return;
    }

    let finalQuestionAnswers = questionAnswers;

    let tests: Test[] = [];
    for (let i = 0; i < questionAnswers.length; i++) {
        if (tests.find(test => test._id.equals(questionAnswers[i].test))) { 
            continue;
        }
        const test = await TestsDao.getTestById(questionAnswers[i].test);
        console.log(test)
        if (!test) {
            log(LogLevel.Warning, `Test ${questionAnswers[i].test} from test answer not found`);
            finalQuestionAnswers.filter(questionAnswer => !questionAnswer.test.equals(questionAnswers[i].test));
        } else {
            tests.push(test);
        }
    }

    let questions: Question[] = [];
    for (let i = 0; i < tests.length; i++) {
        for (let j = 1; j <= tests[i].totalQuestions; j++) {
            const question = await QuestionsDao.getQuestionByTestIdAndQuestionNumber(tests[i]._id, j);
            if (!question) {
                log(LogLevel.Warning, `Question ${j} from test ${tests[i]._id} not found`);
            } else {
                questions.push(question);
            }
        }
    }


    if (questions.length !== finalQuestionAnswers.length) {
        res.status(500).json(`Er is iets misgegaan bij het ophalen van de antwoorden (hoeveelheid vragen van de toetsen komen niet overeen met de hoeveelheid antwoorden van de leerling, (totaal vragen: ${questions.length} totaal antwoorden: ${finalQuestionAnswers.length}))`);
        return;
    }


    let testResults: TestResult[] = [];
    for (let i = 0; i < tests.length; i++) {
        let testResultQuestions: TestResultQuestion[] = [];
        for (let j = 0; j < questions.length; j++) {
            const questionAnswer = finalQuestionAnswers.find(questionAnswer => questionAnswer.test.equals(questions[j].test) && questionAnswer.questionNumber === questions[j].questionNumber);
            if (!questionAnswer) {
                res.status(500).json(`Er kon geen antwoord gevonden worden bij vraag ${questions[j].questionNumber} van toets ${tests[i].name} (id: ${tests[i]._id})`);
                return;
            }

            testResultQuestions.push({
                questionNumber: questionAnswer.questionNumber,
                totalPoints: questions[j].points,
                pointsGained: questionAnswer.points,
                domain: questions[j].domain,
                dimension: questions[j].dimension,
                questionType: questions[j].questionType
            });
        }
        testResults.push({
            name: tests[i].name,
            totalPoints: tests[i].totalPoints,
            totalQuestions: tests[i].totalQuestions,
            version: tests[i].version,
            questions: testResultQuestions
        });
    }

    res.status(200).json(testResults);

}