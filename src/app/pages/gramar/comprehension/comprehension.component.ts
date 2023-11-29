import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension } from '../api/comprehensionobj';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent {
  breadCrumbItems!: Array<{}>;
  comprehensions: Comprehension[] = [];
  emp: Comprehension = new Comprehension();
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  form: FormGroup | undefined;
  
  qualificationType:string='';

MessageFormData: FormGroup;


@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
questions: any;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) { 
   this.MessageFormData = new FormGroup({  
    'no': new FormControl('', Validators.required),   
    'title': new FormControl('', Validators.required),      
    'paragraph': new FormControl('', Validators.required), 
    
    'a': new FormControl('', Validators.required), 
    'b': new FormControl('', Validators.required), 
    'c': new FormControl('', Validators.required), 
    'd': new FormControl('', Validators.required), 
    'answer': new FormControl('', Validators.required), 
    'qno': new FormControl('', Validators.required), 
    'qtype': new FormControl('', Validators.required), 
    'qstn': new FormControl('', Validators.required), 
    
  });
  
  
  if (this.emp != null) {
    this.MessageFormData.patchValue({  
      id:this.emp.id,    
      no: this.emp.no,
      title: this.emp.title,
      paragraph: this.emp.paragraph,
      a: this.emp.a,
      b: this.emp.b,
      c: this.emp.c,
      d: this.emp.d,
      answer: this.emp.answer,
      qno: this.emp.qno,
      qtype: this.emp.qtype,
      qstn: this.emp.qstn,

    });
    this.emp.no= this.emp.no;  
    this.emp.title= this.emp.title;
    this.emp.id= this.emp.id; 
   this.emp. paragraph =this.emp.paragraph;
   this.emp.a= this.emp.a,
   this.emp.b= this.emp.b,
   this.emp.c= this.emp.c,
   this.emp.d= this.emp.d,
   this.emp.answer= this.emp.answer,
   this.emp.qno= this.emp.qno,
   this.emp.qtype= this.emp.qtype,
   this.emp.qstn= this.emp.qstn
  } }
  
  // createQuestion(): FormGroup {
  //   return this.fb.group({
  //     qstn: '',
  //     qtype: 'text',
  //     a: '',
  //     b: '',
  //     c: '',
  //     d: '',
  //     correctAnswer: ''
  //   });
  // }

  ngOnInit() {
    
    this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
      this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
    });

    // this.form = this.fb.group({
    //   questions: this.fb.array([this.createQuestion()])
    // });

  }
  

  // addQuestion() {
  //   const questions = this.form.get('questions') as FormArray;
  //   questions.push(this.createQuestion());
  // }
  // ngOnInit() {
  //   this.apiService.getComprehensionData(this.GrammarId).subscribe((actions) => {
  //     this.comprehensions = actions.map((action) => {
  //       const data = action.payload.doc.data() as Comprehension;
  //       const id = action.payload.doc.id;
  //       return { id, ...data };
  //     });
  //   });
  // }
  


  
  click(){
    this.qualificationType='MCQA';
  }
  click1(){
    this.qualificationType='';
  }
  que2(){
    this.qualificationType='MCQA';
  }
  ques2(){
    this.qualificationType='';
  }
save(id:string){
  this.apiService.createComprehensionQuestions(this.emp,this.GrammarId);
  this.addCourse?.hide();
  this.emp = new Comprehension();
}

editStudent(index: number) {
  const selectedStudent = this.comprehensions [index];
 
 
  this.emp = { ...selectedStudent };
 
  this.MessageFormData.patchValue({
    id:this.emp.id,    
    no: this.emp.no,
    title: this.emp.title,
    paragraph: this.emp.paragraph,
    a: this.emp.a,
    b: this.emp.b,
    c: this.emp.c,
    d: this.emp.d,
    answer: this.emp.answer,
    qno: this.emp.qno,
    qtype: this.emp.qtype,
    qstn: this.emp.qstn,
  });
 
  this.deleteRecordModal?.show();




  this.deleteRecordModal?.onHidden.subscribe(() => {
    this.MessageFormData.reset();
  
  });
}

delet(id: string){
  this.apiService.deleteComprehensionData(id,this.GrammarId)
    }

    update(id: string)
   {
     this.apiService.updateComprehensionData(id.toString(),this.emp,this.GrammarId);
     this.emp = new Comprehension();
     this.deleteRecordModal?.hide();
      //this.resetForm;




   }
   


}
