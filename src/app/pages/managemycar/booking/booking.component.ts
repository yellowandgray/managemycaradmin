import { Component, ViewChild } from '@angular/core';
import { Booking } from '../api/bookingobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  [x: string]: any;
  breadCrumbItems!: Array<{}>;
 
  students: Booking[] = [];
  MessageFormData: FormGroup;
  emp: Booking = new Booking();
  deleteId:string='';


 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  dataSubscription: Subscription | null = null;
 
  selectedImage: any = null;
  loading: boolean = true;


  selectedStandard: string = '';

  addressData: Observable<any[]> = new Observable<any[]>();
  


  selectedSection: string = '';
  searchTerm: string = '';
  filteredStudents: Booking[] = [];
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
      'bookingdate': new FormControl('', Validators.required),  
      'motdue': new FormControl('', Validators.required),      
      'motnotes': new FormControl('', Validators.required),      
      'status': new FormControl('', Validators.required),    
      'batch': new FormControl('', Validators.required),    
      'time': new FormControl('', Validators.required),      
      'totalamount': new FormControl('', Validators.required),
        
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {




      this.MessageFormData.patchValue({      
        bookingdate: this.emp.bookingdate,
        motdue: this.emp.motdue,
        motnotes: this.emp.motnotes,
        status: this.emp.status,
        time:  this.emp.time,  
        totalamount:  this.emp.totalamount,  
      
 
      });
      // this.key = this.data.data.key;
      this.emp.bookingdate= this.emp.bookingdate;
      this.emp.motdue= this.emp.motdue;  
      this.emp.motnotes= this.emp.motnotes;  
      this.emp.status= this.emp.status;
      this.emp.time= this.emp.time;  
      this.emp.totalamount= this.emp.totalamount;  

     
    }
  
    
  }


  ngOnInit() {

    this.loading= true;
   
    this.dataSubscription = this.apiService.getAddressBookData().subscribe(
      (actions) => {
        this.students = actions.map((action) => action.payload.doc.data() as Booking);
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
    this.addressData = this.apiService.getAddressData(id);
    console.log()
    this.deleteModal?.show()
     this.deleteId=id;



  }




  delet(id: string){
this.apiService.deleteStudentData(id)
this.deleteModal?.hide()
  }
  onsubmit(){
   
  }


  
  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Booking();
 
  }
 

  save() {
console.log("student data",this.emp);
this.apiService.createStudentData(this.emp);
this.deleteRecordModal?.hide()

  }

  editStudent(index: number) {
 

  this.emp = { ...this.students[index] };

   
    this.MessageFormData.patchValue({
      id:this.emp.id,
      bookingdate: this.emp.bookingdate,
      motdue: this.emp.motdue,
      motnotes: this.emp.motnotes,
      status: this.emp.status,
      time:  this.emp.time,  
      totalamount:  this.emp.totalamount,  
    });
    this.showModals?.show();
 
   
  }
  update(id: string)
  {
  console.log(id)
     this.apiService.updateStudentData(id.toString(), this.emp);
     this.emp = new Booking();
     this.showModals?.hide();
     
   
  }


}
