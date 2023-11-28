import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension } from '../api/comprehensionobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent {
  breadCrumbItems!: Array<{}>;
  comprehensions: Comprehension[] = [];
  emp: Comprehension = new Comprehension();
  SchoolId:string='XOO5IdohbzztfCg4GU6y';
  qualificationType:string='mcq';
  qualificationType2:string='';
  qualificationType3:string='';
  qualificationType4:string='';
  qualificationType5:string='';
  MessageFormData: FormGroup;
  
  ngOnInit() {
    
    this.apiService.getComprehensionData(this.SchoolId).subscribe(actions => {
      this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
    });
  }
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) {  this.MessageFormData = new FormGroup({  
    'age': new FormControl('', Validators.required),   
    'name': new FormControl('', Validators.required),      
    'dob': new FormControl('', Validators.required),      
    'doj': new FormControl('', Validators.required),      
  
    
  });  }

 
  click(){
    this.qualificationType='mcq';
  }
  click1(){
    this.qualificationType='';
  }
  click2(){
    this.qualificationType2='mcq';
  }
  click3(){
    this.qualificationType2='';
  }
  click4(){
    this.qualificationType3='mcq';
  }
  click5(){
    this.qualificationType3='';
  }
  click6(){
    this.qualificationType4='mcq';
  }
  click7(){
    this.qualificationType4='';
  }
  click8(){
    this.qualificationType5='mcq';
  }
  click19(){
    this.qualificationType5='';
  }




}
