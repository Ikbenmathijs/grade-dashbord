import { ObjectId } from "mongodb";
import educationLevel from "../../enums/Test/educationLevel";


export default interface Test {
    _id: ObjectId;
    name: string;
    totalPoints: number;
    totalQuestions: number;
    Sheetcode: string;
    Version: string;
}