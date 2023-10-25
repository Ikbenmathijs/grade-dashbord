import { ObjectId } from "mongodb";
import educationLevel from "../../enums/Test/educationLevel";


export default interface Test {
    _id: ObjectId;
    name: string;
    educationLevel: educationLevel;
    educationYear: number;
    year: number;
}