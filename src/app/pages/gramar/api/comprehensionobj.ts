

// export class Comprehension {
//      id:string='';
//      no:string='';
//      title: string=''  ;   
//      paragraph: string='' ; 
//    a:string='';
//    b:string='';
//   c:string='';
//   d:string='';
//   answer:string='';
//   // qno:number='';
//   qtype:string='';
//   qstn:string='';
//   }

 
// export interface Question {
//   qstn: string;
//   qtype: string;
//   a?: string;
//   b?: string;
//   c?: string;
//   d?: string;
//   answer?: string;
// }
// export interface Question {
//   qno: number;
//   qstn: string;
//   qtype: string;
//   a?: string;
//   b?: string;
//   c?: string;
//   d?: string;
//   answer?: string;
// }

// export class Comprehension {
//   id: string = '';
//   no: string = '';
//   title: string = '';
//   paragraph: string = '';
//   questions: Question[] = [];
// }
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
}