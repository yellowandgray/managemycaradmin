export class CreateMarks {
    stud_id: string = '';
    year: string = '';
    test_id: string = '';
    marks: {
      tamil: string;
      english: string;
      mathematics: string;
      science: string;
      history: string;
    } = {
      tamil: '',
      english: '',
      mathematics: '',
      science: '',
      history: '',
    };
  }