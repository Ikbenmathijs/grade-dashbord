import { ObjectId } from "mongodb";
import questionDomain from "../../enums/Test/questionDomain";
import questionDimension from "../../enums/Test/questionDimension";
import questionType from "../../enums/Test/questionType";


export default interface Question {
    _id: ObjectId;
    question: string;
    answers: string[];
    correctAnswer: number;
    domain: questionDomain;
    dimension: questionDimension;
    questionType: questionType;
}