import { Component, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Student } from '../api/addressobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
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

 
  emps: { image: string } = { image: '' }; // Assuming emp object has an image property
 
  //selectedImage: File | null = null;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
 
  image_path: string = '';
  imgSrc: string='';
  selectedImage: any = null;

  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) {
   
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
        number: this.emp.rec_no,
        image:this.emp.image,
 
      });
      // this.key = this.data.data.key;
      this.emp.rec_no= this.emp.rec_no; 
      this.emp.Dob= this.emp.Dob;  
      this.emp.name= this.emp.name;  
      this.emp.address= this.emp.address; 
      this.emp.mobile= this.emp.mobile;  
      this.emp.parentname= this.emp.parentname;  
      this.emp.section= this.emp.standard;  
      this.emp.id= this.emp.id;  
      this.emp.standard= this.emp.standard;  
      this.emp.image=this.emp.image;
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
 
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.image_path='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);

        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.image = url;
              console.log('imagePathsdb:', this.emp.image ); // Check if it's populated here
            });
          })
        ).subscribe(
          () => {
            console.log('Upload completed successfully');
          },
          (error) => {
            console.error('Upload error:', error);
          }
        );
      }

    }
    else {
      this.imgSrc = '/assets/images/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }
  
  // onFileUploaded(event:any) {
  //   console.log("1111111111"+event);
  //   console.log(event[0]);
  //   this.files.push(event[0]);
  //   console.log("222222"+this.files[0]);
  //   if (this.files) {
  //     console.log("333333333");
  //     const reader = new FileReader();
  //     const file = this.files[0];
  //     this.selectedImage = this.files[0];
  //     reader.onload = (e: any) => {
  //      // this.imgSrc = e.target.result;
  
  //       const imagePath = e.target.result;
  //       this.imgSrc = e.target.result;
  //      // this.imagePath.push(imagePath);
  
  //       if (this.selectedImage != null) {
  //         var category = 'images';
  //         var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
  //         const fileRef = this.storage.ref(filePath);
  
  //         this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
  //           finalize(() => {
  //             fileRef.getDownloadURL().subscribe((url) => {
  //               this.emp.image = url;
  //               console.log('imagePathsdb:', this.emp.image ); // Check if it's populated here
  //             });
  //           })
  //         ).subscribe(
  //           () => {
  //             console.log('Upload completed successfully');
  //           },
  //           (error) => {
  //             console.error('Upload error:', error);
  //           }
  //         );
  //       }
  //     };
  
  //     reader.readAsDataURL(file);
  //     this.selectedImage = file;
  //   }
  //   else {
  //     this.imgSrc = '/assets/images/image_placeholder.jpg';
  //     this.selectedImage = null;
  //   }
  // }
  
  save() {
   
    if (this.selectedImage) {
      this.apiService.createStudentData(this.emp);
      this.emp = new Student(); 
    } else {
      // If no file is selected, save the item data without an image.
      console.log("Else Running");
     
     console.log(this.emp);  
     this.apiService.createStudentData(this.emp);
      this.emp = new Student();
       
    }
    this.deleteRecordModal?.hide()
  }

  


   update(id: string)
   {
     this.apiService.updateStudentData(id.toString(),this.emp);
     this.emp = new Student();
     this.showModals?.hide(); 

   }
   
   editStudent(index: number) {
    const selectedStudent = this.students[index];
    this.emp = { ...selectedStudent }; // Copy selected student data to emp object
    
    this.MessageFormData.patchValue({
      rec_no: this.emp.rec_no,
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
  
  resetForm() {
    this.selectedImage = null;
    this.isSubmitted = false;
  }
  


 
}

