import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User, Vehicle } from '../api/userobj';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  breadCrumbItems!: Array<{}>;
  garages: User[] = [];
  MessageFormData: FormGroup;
  emp: User = new User();
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
  vehicleData: Observable<Vehicle[]> = new Observable<Vehicle[]>();


  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;






 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
   
    this.MessageFormData = new FormGroup({  
      'address': new FormControl('', Validators.required),  
      'email': new FormControl('', Validators.required),      
      'firstname': new FormControl('', Validators.required),  
      'lastname': new FormControl('', Validators.required),  
      'phone': new FormControl('', Validators.required),  
      'postcode': new FormControl('', Validators.required),  
        
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {




      this.MessageFormData.patchValue({      
        address: this.emp.address,
        email: this.emp.email,
        firstname: this.emp.firstname,
        lastname: this.emp.lastname,
        phone: this.emp.phone,
        postcode: this.emp.postcode,
 
      });
      // this.key = this.data.data.key;
      this.emp.address= this.emp.address;
      this.emp.email= this.emp.email;
      this.emp.firstname= this.emp.firstname; 
      this.emp.lastname= this.emp.lastname; 
      this.emp.phone= this.emp.phone; 
      this.emp.postcode= this.emp.postcode;  
        

 
    }
  
    
  }


  ngOnInit() {

    this.loading= true;
   
    this.dataSubscription = this.apiService.getUserData().subscribe(
      (actions) => {
        this.garages = actions.map((action) => action.payload.doc.data() as User);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
       
      }
    );


  }

  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
 
  deletpop(id:string){
    this.vehicleData = this.apiService.getVehicleData(id);
    console.log(this.vehicleData)
    this.deleteModal?.show()
     this.deleteId=id;
  }

  delet(id: string){
this.apiService.deleteUserData(id)
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
    this.emp = new User();
 
  }
 

  save() {
console.log("student data",this.emp);
this.apiService.createUserData(this.emp);
this.deleteRecordModal?.hide()

  }

  editStudent(index: number) {
 

  this.emp = { ...this.garages[index] };
    this.MessageFormData.patchValue({
      address: this.emp.address,
      email: this.emp.email,
      firstname: this.emp.firstname,
      lastname: this.emp.lastname,
      phone: this.emp.phone,
      postcode: this.emp.postcode,
    });
    this.showModals?.show();
   
  }
  update(id: string)
  {
  console.log(id)
     this.apiService.updateUserData(id.toString(), this.emp);
     this.emp = new User();
     this.showModals?.hide();
     
   
  }

}
