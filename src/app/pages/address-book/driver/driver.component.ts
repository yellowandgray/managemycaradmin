import { Component, ViewChild } from '@angular/core';
import { Driver } from '../api/driverobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent {
  breadCrumbItems!: Array<{}>;
 
  Drivers: Driver[] = [];
  MessageFormData: FormGroup;
  emp: Driver = new Driver();
  searchTerm: string = '';
  filteredDrivers:  Driver[] = [];
 
  emps: { image: string } = { image: '' }; // Assuming emp object has an image property
 
  //selectedImage: File | null = null;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  image_path: string = '';
  image_path1: string = '';
  image_path2: string = '';
  image_path3: string = '';
  imgSrc: string='';
  selectedImage: any = null;
  selectedImage1: any = null;
  selectedImage2: any = null;
  selectedImage3: any = null;
  deleteId:string='';
  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  loading: boolean = true;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) {
   
    this.MessageFormData = new FormGroup({  
      'driverid': new FormControl('', Validators.required),  
      'phn': new FormControl('', Validators.required),  
      'name': new FormControl('', Validators.required),      
      'dob': new FormControl('', Validators.required),      
      'doj': new FormControl('', Validators.required),      
      'town': new FormControl('', Validators.required),      
      'pincode': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),  
      'age': new FormControl('', Validators.required),    
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {


      this.MessageFormData.patchValue({  
        driverid:this.emp.driverid,  
        name: this.emp.name,
        aadhar: this.emp.aadhar,
        address: this.emp.address,
        phn: this.emp.phn,
        age:  this.emp.age,  
        dob:  this.emp.dob,  
        boj:  this.emp.doj,  
        pincode: this.emp.pincode,
        license: this.emp.license,
        pancard: this.emp.pancard,
        image:this.emp.pic,
 
      });
      // this.key = this.data.data.key;
      // this.emp.rec_no= this.emp.rec_no;
     
      this.emp.name= this.emp.name;  
      this.emp.address= this.emp.address;
      this.emp.phn= this.emp.phn;  
      this.emp.age= this.emp.age;  
      this.emp.dob= this.emp.dob;  
      this.emp.doj= this.emp.doj;  
      this.emp.pincode= this.emp.pincode;  
      this.emp.pic=this.emp.pic;
      this.emp.aadhar= this.emp.aadhar;  
      this.emp.pancard= this.emp.pancard;  
      this.emp.license= this.emp.license;  
      this.emp.driverid=this.emp.driverid;  
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
    // getAddressBookData()
  }




  ngOnInit() {
    this.loading= true;
   
    this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
      this.Drivers = actions.map(action => action.payload.doc.data() as Driver);
      this.filteredDrivers = [...this.Drivers];
      this.loading = false; 
    });
  }
  delet(driverid: string){
this.apiService.deleteDriverData(driverid,this.SchoolId);
this.deleteModal?.hide()
  }


  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
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
              this.emp.pic = url;
           
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


  showPreview1(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage1 = event.target.files[0];
      this.image_path1='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage1.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);


        this.storage.upload(filePath, this.selectedImage1).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.license = url;
           
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
      this.selectedImage1 = null;
    }
  }


  showPreview3(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage3 = event.target.files[0];
      this.image_path3='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage3.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);


        this.storage.upload(filePath, this.selectedImage3).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.aadhar = url;
           
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
      this.selectedImage1 = null;
    }
  }
  showPreview2(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage2 = event.target.files[0];
      this.image_path2='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage2.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);


        this.storage.upload(filePath, this.selectedImage2).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.pancard = url;
           
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
      this.selectedImage1 = null;
    }
  }
 
 
  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;

  }

 
  save() {


    if (this.selectedImage) {
      this.apiService.createDriverData(this.emp,this.SchoolId);
      this.emp = new Driver();
    } else {
      // If no file is selected, save the item data without an image.
     
     this.apiService.createDriverData(this.emp,this.SchoolId);
      this.emp = new Driver();
       
    }
    this.deleteRecordModal?.hide()
  }




 




   update(driverid: string)
   {
     this.apiService.updateDriverData(driverid.toString(),this.emp,this.SchoolId);
     this.emp = new Driver();
     this.showModals?.hide();
     this.resetForm;


   }
   
   editDriver(index: number) {
    const selectedDriver = this.Drivers[index];
    this.emp = { ...selectedDriver }; // Copy selected Driver data to emp object
   
    this.MessageFormData.patchValue({
      deriverid:this.emp.driverid,
      name: this.emp.name,
      aadhar: this.emp.aadhar,
      address: this.emp.address,
      phn: this.emp.phn,
      age:  this.emp.age,  
      dob:  this.emp.dob,  
      boj:  this.emp.doj,  
      pincode: this.emp.pincode,
      pancard:this.emp.pancard,
      license:this.emp.license,
      image:this.emp.pic,
    });
    this.showModals?.show();
    this.resetForm
   
  }
 
  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }

  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Driver();
   
  }
 
  resetForm() {
    this.selectedImage = null;
    this.isSubmitted = false;
  }


  filteredDriver(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterDriver();
  }
 
 
  filterDriver() {
    console.log('Filtering...', this.searchTerm);


    this.filteredDrivers = this.Drivers.filter(Driver=> {
     
      const nameMatch = !this.searchTerm || Driver.name.toLowerCase().includes(this.searchTerm.toLowerCase());


      return nameMatch;
    });


    if (!this.filteredDrivers.length) {
      console.log('Nooo Students...');
      this.filteredDrivers = [];
      console.log(this.filteredDrivers);
    }
  }


}



