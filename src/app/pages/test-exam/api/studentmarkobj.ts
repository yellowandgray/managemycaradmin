export class CreateMarks {
    stud_id: string = '';
    year: string = '';
    test_id: string = '';
    marks: {
      tamil: number;
      english: number;
      mathematics: number;
      science: number;
      history: number;
    } = {
      tamil: 0,
      english: 0,
      mathematics: 0,
      science: 0,
      history: 0,
    };
    // total: number = 0; 

    
    // updateTotal(): void {
    //   this.total = Object.values(this.marks).reduce((acc, mark) => acc + mark, 0);
    // }
  
  }