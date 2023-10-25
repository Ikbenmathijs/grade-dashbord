import {Workbook, Worksheet} from "exceljs";
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
        
    } catch (e) {
        console.log(e);
    }
    
}