import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}


  readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();


      reader.onload = (e: any) => {
        try {
          const workbook: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName: string = workbook.SheetNames[0];
          const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];


          const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });


          // Assuming the first row contains headers, so we skip it
          const data = jsonData.slice(1);


          resolve(data);
        } catch (error) {
          reject(error);
        }
      };


      reader.readAsBinaryString(file);
    });
  }
}



