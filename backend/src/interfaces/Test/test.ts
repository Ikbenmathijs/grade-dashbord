import { ObjectId } from "mongodb";


export default interface Test {
    _id: ObjectId;
    name: string;
    totalPoints: number;
    totalQuestions: number;
    sheetCode: string;
    version: string;
}