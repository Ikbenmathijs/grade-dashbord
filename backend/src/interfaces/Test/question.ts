import { ObjectId } from "mongodb";
import QuestionDomain from "../../enums/Test/questionDomain";
import QuestionDimension from "../../enums/Test/questionDimension";
import QuestionType from "../../enums/Test/questionType";


export default interface Question {
    _id: ObjectId;
    test: ObjectId;
    questionNumber: number;
    points: number;
    domain: QuestionDomain;
    dimension: QuestionDimension;
    questionType: QuestionType;
}