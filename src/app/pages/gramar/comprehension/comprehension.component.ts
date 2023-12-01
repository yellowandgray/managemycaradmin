import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension, Question } from '../api/comprehensionobj';
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
  
  MessageFormData: FormGroup;
  questions: Question[] = [];

 

@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private formBuilder: FormBuilder,private fb: FormBuilder) { 
   this.MessageFormData = new FormGroup({  
    'no': new FormControl('', Validators.required),   
    'title': new FormControl('', Validators.required),      
    'paragraph': new FormControl('', Validators.required), 
    'questions': new FormControl([])
    // this.MessageFormData = this.formBuilder.group({
    //   no: ['', Validators.required],
    //   title: ['', Validators.required],
    //   paragraph: ['', Validators.required],
    //   questions: this.formBuilder.array([]) // FormArray for questions
    });
  
  

 
  if (this.emp != null) {
    this.MessageFormData.patchValue({  
      id:this.emp.id,    
      no: this.emp.no,
      title: this.emp.title,
      paragraph: this.emp.paragraph,
     questions:this.emp.questions

    });
    this.emp.no= this.emp.no;  
    this.emp.title= this.emp.title;
    this.emp.id= this.emp.id; 
    this.emp. paragraph =this.emp.paragraph;
    this.emp. questions =this.emp.questions;
   
  } }
  
  
  ngOnInit() {
    
    this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
      this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
      console.log( this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension))
    });


  }
  // ngOnInit() {
  //   this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
  //     this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
  //   });
  // }

  // addQuestion() {
  //   this.emp.questions.push({ qstn: '', qtype: 'MCQA', a: '', b: '', c: '', d: '',qno: this.emp.questions.length + 1, answer: '' });
  //   console.log(this.emp.questions)
  // }
  addQuestion() {
    const questionGroup = this.fb.group({
      qstn: ['', Validators.required],
      qtype: ['MCQA', Validators.required],
      a: ['', Validators.required],
      b: ['', Validators.required],
      c: ['', Validators.required], 
      d: ['', Validators.required],
      answer: ['', Validators.required],
      qno: this.emp.questions.length + 1,
     
    });

    (this.MessageFormData.get('questions') as FormArray).push(questionGroup);
  }
 
  
  
  get questionsForm() {
    return this.MessageFormData.get('questions') as FormArray;
  }
 
  
  get questionsFormArray() {
    return this.MessageFormData.get('questions') as FormArray;
  }
  


save(id:string){
  this.apiService.createComprehensionQuestions(this.emp,this.GrammarId);
  this.addCourse?.hide();
  this.emp = new Comprehension();
 
}


printFormData() {
  console.log('Printed Form Data:', this.MessageFormData.value);

}


// editComprehension(index: number) {
//   const selectedStudent = this.comprehensions [index];
 
 
//   this.emp = { ...selectedStudent };
 
//   this.MessageFormData.patchValue({
//     id:this.emp.id,    
//     no: this.emp.no,
//     title: this.emp.title,
//     paragraph: this.emp.paragraph,
 
//   });
 
//   this.deleteRecordModal?.show();

//   this.deleteRecordModal?.onHidden.subscribe(() => {
//     this.MessageFormData.reset();
  
//   });
// }


// editComprehension(index: number) {
//   const selectedComprehension = this.comprehensions[index];

//   this.emp = { ...selectedComprehension };

//   this.MessageFormData.patchValue({
//     id: this.emp.id,
//     no: this.emp.no,
//     title: this.emp.title,
//     paragraph: this.emp.paragraph,
//     questions:this.emp.questions
//   });

  
//   this.deleteRecordModal?.show();

//   // Subscribe to modal hidden event to reset the form
//   this.deleteRecordModal?.onHidden.subscribe(() => {
//     this.MessageFormData.reset();
//   });
// }



editComprehension(index: number) {
  const selectedComprehension = this.comprehensions[index];

  if (selectedComprehension) {
    this.emp = { ...selectedComprehension };

    if (this.emp.questions) {
      const questionFormArray = this.emp.questions.map(question => {
        return this.fb.group({
          qstn: [question.qstn],
          a: [question.a],
          b: [question.b],
          c: [question.c],
          d: [question.d],
          answer: [question.answer]
        });
      });

      this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
    }

    this.MessageFormData.patchValue({
      id: this.emp.id,
      no: this.emp.no,
      title: this.emp.title,
      paragraph: this.emp.paragraph,
    });

    this.deleteRecordModal?.show();

    this.deleteRecordModal?.onHidden.subscribe(() => {
      this.MessageFormData.reset();
    });
  }
}


delet(id: string){
  console.log(id,'check')
  this.apiService.quarydeleteComprehensionData(this.GrammarId,id)
  console.log(this.apiService.quarydeleteComprehensionData(id,this.GrammarId),'check')

    }


  update(id: string)
   {
     this.apiService.updateComprehensionData(id.toString(),this.emp,this.GrammarId);
     this.emp = new Comprehension();
     this.deleteRecordModal?.hide();
      // this.resetForm;

   }
   
   



  
}
