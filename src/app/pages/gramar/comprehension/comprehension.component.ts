import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension } from '../api/comprehensionobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  qualificationType:string='';

MessageFormData: FormGroup;


@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;

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


  ngOnInit() {
    
    this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
      this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
    });
  }
  click(){
    this.qualificationType='mcq';
  }
  click1(){
    this.qualificationType='';
  }
save(id:string){
  this.apiService.createComprehensionQuestions(this.emp,this.GrammarId);
  this.addCourse?.hide();
  this.emp = new Comprehension();
}


delet(id: string){
  this.apiService.deleteComprehensionData(id,this.GrammarId)
    }

    update(id: string)
   {
     this.apiService.updateComprehensionData(id.toString(),this.emp,this.GrammarId);
     this.emp = new Comprehension();
    //  this.showModals?.hide();
    //  this.resetForm;




   }
   


}
