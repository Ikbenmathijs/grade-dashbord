import {Workbook, Worksheet, Cell, ValueType} from "exceljs";
import testLayout from "./sheetLayouts/testLayout";
import testDataLayout from "./sheetLayouts/testDataLayout";
import Test from "../interfaces/Test/test";
import { ObjectId } from "mongodb";
import Question from "../interfaces/Test/question";
import QuestionDomain, { stringToQuestionDomain } from "../enums/Test/questionDomain";
import QuestionDimension, { letterToQuestionDimension } from "../enums/Test/questionDimension";
import QuestionType, { letterToQuestionType } from "../enums/Test/questionType";




const workbook = new Workbook();

workbook.xlsx.readFile("./resources/dummy.xlsx").then(() => {
    const sheet = workbook.getWorksheet(testDataLayout.sheetName);
    let tests = [];
    if (sheet) {
        for (let startRow = 0; startRow < 10000; startRow += 5) {
            tests.push(readTestData(sheet, startRow));
        }
    } else {
        throw new Error(`Blad ${testDataLayout.sheetName} niet gevonden!`);
    }

    console.log(tests);
 });



function getTestSheet(workbook: Workbook, sheetCode: string): Worksheet {
    const sheets = workbook.worksheets;
    
    for (let i = 0; i < sheets.length; i++) {
        const sheetCode = sheets[i].getCell(testLayout.sheetCodeRow, testLayout.sheetCodeColumn);
        if (sheetCode.type == ValueType.String) {
            if (sheetCode.value == sheetCode) {
                return sheets[i];
            }
        }
    }
    throw new Error(`Blad met bladcode ${sheetCode} niet gevonden!`);
}

function readTestData(sheet: Worksheet, startRow: number): {test: Test; questions: Question[]} {

    const totalPointsCell = sheet.getCell(testDataLayout.totalPointsRowIndex + startRow, testDataLayout.totalPointsColumn);
    console.log(sheet.name);
    console.log(totalPointsCell.type);
    console.log(totalPointsCell.value);
    if (totalPointsCell.type != ValueType.Number) {
        throw new Error(`Totaal punten op rij ${testDataLayout.totalPointsRowIndex + startRow} in ${testDataLayout.sheetName} is geen nummer! (rij nr: ${testDataLayout.totalPointsRowIndex + startRow}, col nr: ${testDataLayout.totalPointsColumn})`);
    }
    const totalPoints = totalPointsCell.value as number;

    const sheetCodeCell = sheet.getCell(testDataLayout.sheetCodeRowIndex + startRow, testDataLayout.sheetCodeColumn);
    if (sheetCodeCell.type != ValueType.String) {
        throw new Error(`Bladcode op rij ${testDataLayout.sheetCodeRowIndex + startRow} in ${testDataLayout.sheetName} is geen string! (rij nr: ${testDataLayout.sheetCodeRowIndex + startRow}, col nr: ${testDataLayout.sheetCodeColumn})`);
    }
    const sheetCode = sheetCodeCell.value as string;

    const testNameCell = sheet.getCell(testDataLayout.testNameRowIndex + startRow, testDataLayout.testNameColumn);
    if (testNameCell.type != ValueType.String) {
        throw new Error(`Toetsnaam op rij ${testDataLayout.testNameRowIndex + startRow} in ${testDataLayout.sheetName} is geen string! (rij nr: ${testDataLayout.testNameRowIndex + startRow}, col nr: ${testDataLayout.testNameColumn})`);
    }
    const testName = testNameCell.value as string;

    const versionCell = sheet.getCell(testDataLayout.testVersionRowIndex + startRow, testDataLayout.testVersionColumn);
    if (versionCell.type != ValueType.String && versionCell.type != ValueType.Number) {
        throw new Error(`Versie op rij ${testDataLayout.testVersionRowIndex + startRow} in ${testDataLayout.sheetName} is geen string of nummer! (rij nr: ${testDataLayout.testVersionRowIndex + startRow}, col nr: ${testDataLayout.testVersionColumn})`);
    }
    const version = `${versionCell.value}`;

    const totalQuestionsCell = sheet.getCell(testDataLayout.totalQuestionsRowIndex + startRow, testDataLayout.totalQuestionsColumn);
    if (totalQuestionsCell.type != ValueType.Number) {
        throw new Error(`Aantal vragen op rij ${testDataLayout.totalQuestionsRowIndex + startRow} in ${testDataLayout.sheetName} is geen nummer! (rij nr: ${testDataLayout.totalQuestionsRowIndex + startRow}, col nr: ${testDataLayout.totalQuestionsColumn})`);
    }
    const totalQuestions = totalQuestionsCell.value as number;

    let testData: Test = {
        _id: new ObjectId(),
        name: testName,
        Sheetcode: sheetCode,
        totalPoints: totalPoints,
        Version: version,
        totalQuestions: totalQuestions
    }


    let questions: Question[] = [];
    for (let i = 0; i < totalQuestions; i++) {
        let currentColumn = testDataLayout.firstQuestionColumn + i;


        let questionNumberCell = sheet.getCell(testDataLayout.questionNumberRowIndex + startRow, currentColumn);
        const questionNumber = getCellValueAsNumber(questionNumberCell, new Error(`Vraagnummer op rij ${testDataLayout.questionNumberRowIndex + startRow} in ${testDataLayout.sheetName} is geen nummer! (rij nr: ${testDataLayout.questionNumberRowIndex + startRow}, col nr: ${currentColumn})`));

        let questionPointsCell = sheet.getCell(testDataLayout.questionPointsRowIndex + startRow, currentColumn);
        const questionPoints = getCellValueAsNumber(questionPointsCell, new Error(`Vraagpunten op rij ${testDataLayout.questionPointsRowIndex + startRow} in ${testDataLayout.sheetName} is geen nummer! (rij nr: ${testDataLayout.questionPointsRowIndex + startRow}, col nr: ${currentColumn})`));

        let questionDimensionCell = sheet.getCell(testDataLayout.questionDimensionRowIndex + startRow, currentColumn);
        const questionDimension = getCellValueAsString(questionDimensionCell, new Error(`Vraagdimensie op rij ${testDataLayout.questionDimensionRowIndex + startRow} in ${testDataLayout.sheetName} is geen string! (rij nr: ${testDataLayout.questionDimensionRowIndex + startRow}, col nr: ${currentColumn})`));

        let questionTypeCell = sheet.getCell(testDataLayout.questionTypeRowIndex + startRow, currentColumn);
        const questionTypeString = getCellValueAsString(questionTypeCell, new Error(`Vraagtype op rij ${testDataLayout.questionTypeRowIndex + startRow} in ${testDataLayout.sheetName} is geen string! (rij nr: ${testDataLayout.questionTypeRowIndex + startRow}, col nr: ${currentColumn})`));

        let questionDomainCell = sheet.getCell(testDataLayout.questionDomainRowIndex + startRow, currentColumn);
        const questionDomainString = getCellValueAsString(questionDomainCell, new Error(`Vraagdomein op rij ${testDataLayout.questionDomainRowIndex + startRow} in ${testDataLayout.sheetName} is geen string! (rij nr: ${testDataLayout.questionDomainRowIndex + startRow}, col nr: ${currentColumn})`));


        let domain: QuestionDomain;
        try {
            domain = stringToQuestionDomain(questionDomainString);
        } catch (e) {
            throw new Error(`Vraagdomein op rij ${testDataLayout.questionDomainRowIndex + startRow} in ${testDataLayout.sheetName} is geen geldig vraagdomein! (rij nr: ${testDataLayout.questionDomainRowIndex + startRow}, col nr: ${currentColumn})`);
        }

        let dimension: QuestionDimension;
        try {
            dimension = letterToQuestionDimension(questionDimension);
        } catch (e) {
            throw new Error(`Vraagdimensie op rij ${testDataLayout.questionDimensionRowIndex + startRow} in ${testDataLayout.sheetName} is geen geldige vraagdimensie! (rij nr: ${testDataLayout.questionDimensionRowIndex + startRow}, col nr: ${currentColumn})`);
        }

        let questionType: QuestionType;
        try {
            questionType = letterToQuestionType(questionTypeString);
        } catch (e) {
            throw new Error(`Vraagtype op rij ${testDataLayout.questionTypeRowIndex + startRow} in ${testDataLayout.sheetName} is geen geldig vraagtype! (rij nr: ${testDataLayout.questionTypeRowIndex + startRow}, col nr: ${currentColumn})`);
        }


        let question: Question = {
            _id: new ObjectId(),
            test: testData._id,
            questionNumber: questionNumber,
            points: questionPoints,
            dimension: dimension,
            questionType: questionType,
            domain: domain
        }

        questions.push(question);
    }

    return {test: testData, questions: questions};
}


function getCellValueAsNumber(cell: Cell, errorIfInvalidType: Error): number {
    if (cell.type == ValueType.Number) {
        return cell.value as number;
    } else if (cell.type == ValueType.Formula) {
        return cell.result as number;
    } else {
        throw errorIfInvalidType;
    }
}


function getCellValueAsString(cell: Cell, errorIfInvalidType: Error): string {
    if (cell.type == ValueType.String) {
        return cell.value as string;
    } else if (cell.type == ValueType.Formula) {
        return cell.result as string;
    } else {
        throw errorIfInvalidType;
    }
}