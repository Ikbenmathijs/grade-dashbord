import {Workbook, Worksheet, Cell, ValueType} from "exceljs";
import testLayout from "./sheetLayouts/testLayout";
import testDataLayout from "./sheetLayouts/testDataLayout";
import Test from "../interfaces/Test/test";
import { ObjectId } from "mongodb";
import test from "node:test";



const workbook = new Workbook();

workbook.xlsx.readFile("./resources/dummy.xlsx").then(() => {
    const sheet = workbook.getWorksheet(testDataLayout.sheetName);
    if (sheet) {
        for (let startRow = 0; startRow < 10000; startRow += 5) {
            let sheetCode = sheet.getCell(testDataLayout.sheetCodeRowIndex + startRow, testDataLayout.sheetCodeColumn);
            if (sheetCode.type == ValueType.Null) {
                break;
            }
            else if (sheetCode.type == ValueType.String) {

            } else {
                throw new Error(`Bladcode op rij ${testDataLayout.sheetCodeRowIndex + startRow} in ${testDataLayout.sheetName} is geen string, maar niet leeg!`);
            }
        }
    } else {
        throw new Error(`Blad ${testDataLayout.sheetName} niet gevonden!`);
    }
 });



function getTestSheet(workbook: Workbook, sheetCode: string): Worksheet {
    const sheets = workbook.worksheets;
    
    for (let i = 0; i < sheets.length; i++) {
        const sheetCode = sheets[i].getCell(testLayout.sheetCodeRow, testLayout.sheetCodeColumn);
        if 
        
    }
}

function readTestData(sheet: Worksheet, startRow: number) {
    let testName = sheet.getCell(testDataLayout.testNameRowIndex + startRow, testDataLayout.testNameColumn).value;

    let testData: Test = {
        _id: new ObjectId(),

    }
}