import { Component, ViewChild } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Queries } from '../api/queriesobj';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent {
 
  garages: Queries[] = [];
  MessageFormData: FormGroup;
  emp: Queries = new Queries();
  deleteId:string='';


 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  dataSubscription: Subscription | null = null;
 
  selectedImage: any = null;
  loading: boolean = true;


  selectedStandard: string = '';


  


  selectedSection: string = '';
  searchTerm: string = '';

  studentNames: string[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedStudentIndex: number | null = null;
  uploading: boolean = false;
  // private readonly fileName = 'student_bulk_data_template.xlsx';



  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;






 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
   
    this.MessageFormData = new FormGroup({  
      'message': new FormControl('', Validators.required),  
      'userid': new FormControl('', Validators.required),      
     
        
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {




      this.MessageFormData.patchValue({      
        message: this.emp.message,
        userid: this.emp.userid,
      
      
 
      });
      // this.key = this.data.data.key;
      this.emp.message= this.emp.message;
      this.emp.userid= this.emp.userid;  
 
    }
  
    
  }


  ngOnInit() {

    this.loading= true;
   
    this.dataSubscription = this.apiService.getQueriesData().subscribe(
      (actions) => {
        this.garages = actions.map((action) => action.payload.doc.data() as Queries);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
       
      }
    );


  }




  navigateToDetails(name: string) {
 
    this.router.navigate(['/studentdetails', name]);
  }
 
 
  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
 
 
 
 
 
  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;




  }




  delet(id: string){
this.apiService.deleteStudentData(id)
this.deleteModal?.hide()
  }
  onsubmit(){
   
  }
  downloadExcelTemplate(): void {
    const templateFileName = 'student_bulk_data_template.xlsx'; 
    const templateFilePath = 'student/student_bulk_data_template.xlsx'; 

    const fileRef = this.storage.ref(templateFilePath);

    fileRef.getDownloadURL().subscribe((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = templateFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  
  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Queries();
 
  }
 

  save() {
console.log("student data",this.emp);
// this.apiService.createGaragesData(this.emp);
this.deleteRecordModal?.hide()

  }

  editStudent(index: number) {
 

  this.emp = { ...this.garages[index] };

   
    this.MessageFormData.patchValue({
      message: this.emp.message,
      userid: this.emp.userid,
 
    
    });
    this.showModals?.show();
 
   
  }
  update(id: string)
  {
  console.log(id)
    //  this.apiService.updateGaragesData(id.toString(), this.emp);
    //  this.emp = new Queries();
     this.showModals?.hide();
     
   
  }
}
