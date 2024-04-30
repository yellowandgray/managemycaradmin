import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Employer } from '../api/employerobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.scss']
})
export class EmployesComponent {
  breadCrumbItems!: Array<{}>;
  loading: boolean = true;
  employerdata: Employer[] =  [] ;
  MessageFormData: FormGroup;
  emp: Employer = new Employer();
  uploading: boolean = false;
  selectedImage: any = null;

  image_path: string = '';
  imgSrc: string='';
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
    this.MessageFormData = new FormGroup({  
      'businessname': new FormControl('', Validators.required),   
      'city': new FormControl('', Validators.required),      
      'country': new FormControl('', Validators.required),      
      'email': new FormControl('', Validators.required),      
      'firstname': new FormControl('', Validators.required),      
      'lastname': new FormControl('', Validators.required), 
      'officephoneno': new FormControl('', Validators.required), 
      'password': new FormControl('', Validators.required), 
      'phonenumber': new FormControl('', Validators.required),   
          
    });
    
    if (this.emp != null) {
      this.MessageFormData.patchValue({       
        businessname: this.emp.businessname,
        city: this.emp.city,
        country: this.emp.country,
        email: this.emp.email,
        firstname: this.emp.firstname,
        lastname: this.emp.lastname,
        officephoneno: this.emp.officephoneno,
        password: this.emp.password,
        phonenumber: this.emp.phonenumber,
        logo: this.emp.logo,
      });
     
     

      this.emp.businessname= this.emp.businessname,
      this.emp.city= this.emp.city,
      this.emp.country= this.emp.country,
      this.emp.email= this.emp.email,
      this.emp.firstname= this.emp.firstname,
      this.emp.lastname= this.emp.lastname,
      this.emp.officephoneno= this.emp.officephoneno,
      this.emp.password= this.emp.password,
      this.emp.phonenumber= this.emp.phonenumber,
      this.emp.logo= this.emp.logo
      
    }
  }


  ngOnInit() {
    this.loading= true;
    this.apiService.getEmployerData().subscribe(actions => {
      this.employerdata = actions.map(action => action.payload.doc.data()as Employer);
      console.log(this.employerdata,'chekcuiser')
      
    });
    this.loading = false;
    
  }

  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
     this.emp = new Employer();
   
  }
  save() {
    console.log(this.emp); 
     console.log(this.emp);  
     this.apiService.createEmployerData(this.emp);
      this.emp = new Employer();
       
    
    this.deleteRecordModal?.hide()
  }
  update(id: string)
  {
    this.apiService.updateEmployerData(id.toString(),this.emp);
    this.emp = new Employer();
    this.showModals?.hide(); 
 
  }
  
  editTeacher(index: number) {
    const selectedTeacher = this.employerdata[index];
    this.emp = { ...selectedTeacher }; // Copy selected Teacher data to emp object
    
    this.MessageFormData.patchValue({
      businessname: this.emp.businessname,
      city: this.emp.city,
      country: this.emp.country,
      email: this.emp.email,
      firstname: this.emp.firstname,
      lastname: this.emp.lastname,
      officephoneno: this.emp.officephoneno,
      password: this.emp.password,
      phonenumber: this.emp.phonenumber,
      logo: this.emp.logo,
    });
    this.showModals?.show();
   
   
  }


  delet(id: string){
    this.apiService.deleteEmployerData(id)
      }

  showPreview(event: any) {
    this.uploading = true;
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
              this.emp.logo = url;
              this.uploading = false;
              
            });
          })
        ).subscribe(
          () => {
            console.log('Upload completed successfully');
          },
          (error) => {
            console.error('Upload error:', error);
            this.uploading = false;
          }
        );
      }

    }
    else {
      this.imgSrc = '/assets/images/image_placeholder.jpg';
      this.selectedImage = null;
      this.uploading = false;
    }
  }

}
