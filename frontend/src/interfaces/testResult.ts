

import QuestionDomain from "../enums/Test/questionDomain";
import QuestionDimension from "../enums/Test/questionDimension";
import QuestionType from "../enums/Test/questionType";


export interface TestResult {
    name: string;
    totalPoints: number;
    totalQuestions: number;
    version: string;
    questions: TestResultQuestion[];
}

export interface TestResultQuestion {
    questionNumber: number;
    totalPoints: number; 
    pointsGained: number;
    domain: QuestionDomain;
    dimension: QuestionDimension;
    questionType: QuestionType;
}