import { Component, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Student } from '../api/addressobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// import { AngularFireStorage } from '@angular/fire/storage';



@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {
  breadCrumbItems!: Array<{}>;
 
  students: Student[] = [];
  MessageFormData: FormGroup;
  emp: Student = new Student();

  selectedImage: File | null = null;
  emps: { image: string } = { image: '' }; // Assuming emp object has an image property
  isSubmitted = false;

 


  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  
  constructor(private apiService: ApiService ) {
   
    this.MessageFormData = new FormGroup({  
      'number': new FormControl('', Validators.required),   
      'name': new FormControl('', Validators.required),      
      'Dob': new FormControl('', Validators.required),      
      'standard': new FormControl('', Validators.required),      
      'mobile': new FormControl('', Validators.required),      
      'section': new FormControl('', Validators.required), 
      'address': new FormControl('', Validators.required),   
      'parentname': new FormControl('', Validators.required),     
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
        name: this.emp.name,
        Dob: this.emp.Dob,
        address: this.emp.address,
        mobile: this.emp.mobile, 
        section:  this.emp.section,   
        parentname:  this.emp.parentname,  
        standard:  this.emp.standard,  
        number: this.emp.number,
 
      });
      // this.key = this.data.data.key;
      this.emp.number= this.emp.number; 
      this.emp.Dob= this.emp.Dob;  
      this.emp.name= this.emp.name;  
      this.emp.address= this.emp.address; 
      this.emp.mobile= this.emp.mobile;  
      this.emp.parentname= this.emp.parentname;  
      this.emp.section= this.emp.standard;  
      this.emp.id= this.emp.id;  
      this.emp.standard= this.emp.standard;  
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
    // getAddressBookData()
  }

  ngOnInit() {
    // Subscribe to the address-book collection data
    this.apiService.getAddressBookData().subscribe(actions => {
      this.students = actions.map(action => action.payload.doc.data() as Student);
    });
  }
  delet(id: string){
this.apiService.deleteStudentData(id)
  }
  onsubmit(){
   
  }
 
  

  save() {
    //console.log(this.emp);  
     this.apiService.createStudentData(this.emp);
      this.emp = new Student();
    
   }

   update(id: string)
   {
     
     this.apiService.updateStudentData(id.toString(),this.emp);
     this.emp = new Student();

   }
   
   editStudent(index: number) {
    const selectedStudent = this.students[index];
    this.emp = { ...selectedStudent }; // Copy selected student data to emp object
    
    this.MessageFormData.patchValue({
      number: this.emp.number,
      name: this.emp.name,
      standard: this.emp.standard,
      section: this.emp.section,
      Dob: this.emp.Dob,
      parentname: this.emp.parentname,
      address: this.emp.address,
      mobile: this.emp.mobile
    });
    this.showModals?.show();
   
  }
  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }
  // onSubmit() {
  //   this.isSubmitted = true;
  //   if (this.selectedImage) {
  //     var category = 'images';
  //     var fileName = `${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
  //     var filePath = `${category}/${fileName}`;
  //     const fileRef = this.storage.ref(filePath);
      
  //     this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe((url: string) => {
  //           this.emp.image = url;
  //           this.apiService.insertImageDetails(url); // Call your API service to save image details
  //           this.resetForm();
  //         });
  //       })
  //     ).subscribe();
  //   }
  // }

  resetForm() {
    this.selectedImage = null;
    this.isSubmitted = false;
  }
  


 
}

