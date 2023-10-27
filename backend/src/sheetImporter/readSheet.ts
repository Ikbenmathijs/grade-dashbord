import {Workbook, Worksheet, Cell, ValueType} from "exceljs";
import testLayout from "./sheetLayouts/testLayout";



const workbook = new Workbook();

workbook.xlsx.readFile("./resources/dummy.xlsx").then(() => {
    const sheet = workbook.getWorksheet("SE1");
    if (sheet) {

        readTestSheet(sheet);
    }
 });



function readTestSheet(sheet: Worksheet) {
    try {
        const totalQuestions = getTotalQuestions(sheet);
        
        
        


    } catch (e) {
        console.log(e);
    }
    
}


function getTotalQuestions(sheet: Worksheet) {
    try {
        const firstRow = sheet.getRow(testLayout.firstStudentRow);
        const firstQuestionColumn = testLayout.firstQuestionColumn;
        for (let i = firstQuestionColumn; i < 400; i++) {
            const cell = firstRow.getCell(i);

            if (cell.type !== ValueType.Number) {
                return i - firstQuestionColumn;
            }
        }
        throw new Error("Total column not found");
    } catch (e) {
        console.log(e);
        throw e;
    }
}

