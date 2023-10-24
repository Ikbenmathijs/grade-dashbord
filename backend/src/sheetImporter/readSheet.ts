import {Workbook} from "exceljs";



const workbook = new Workbook();

workbook.xlsx.readFile("./resources/dummy.xlsx").then(() => {
    const sheet = workbook.getWorksheet("SE1");
    console.log(sheet?.getRow(17).getCell(7).value);
 });

