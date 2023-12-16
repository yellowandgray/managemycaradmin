
export interface Question {
  id?: string;
  qno: number;
  qstn: string;
  qtype: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  answer?: string;
  [key: string]: string | number | undefined;
}


export class Comprehension {
  id: string = '';
  no: number = null as unknown as number;
  title: string = '';
  paragraph: string = '';
  questions: Question[] = [];
  list_id:string='';
  standard: string[] = [];
}

export class Vocabulary {
  id: string='';
  name: string='';
  pic: string='';
  desc: string='';
}
