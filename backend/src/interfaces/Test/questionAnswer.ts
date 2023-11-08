import { ObjectId} from "mongodb";


export default interface QuestionAnswer {
    _id: ObjectId;
    test: ObjectId;
    questionNumber: number;
    email: string;
    points: number;
}