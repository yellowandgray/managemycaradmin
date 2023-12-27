import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs';

import { Van } from '../../van/api/addvanobj';
import { CreateTest } from '../api/testobj';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {


  breadCrumbItems!: Array<{}>;
  tests: CreateTest[] = [];
  emp: CreateTest =new CreateTest();
  MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  allPossibleStandards: string[] = []; 
  standardsList: string[] = ['UKG', 'LKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  fetchedStandards: string[] = [];
  selectedStandards: string[] = [];
  standardsControl = new FormControl(); 
  isSubmitted = false;
  files: File[] = [];
  loading: boolean = true;
  image_path: string = '';
  imgSrc: string='';
  selectedImage: any = null;
  selectedPreviewImage: string | null = null;
  deleteId:string='';
  uploading: boolean = false;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal?: ModalDirective;
 
//  @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
  // @ViewChild('deleteRecordModal2') deleteRecordModal2: any;
  // @ViewChild('deleteRecordModal') deleteRecordModal: any;
 
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage )
  {
   
    this.MessageFormData = new FormGroup({  
      'name': new FormControl('', Validators.required),  
      'standard': new FormControl([]),  
      'startdate': new FormControl('', Validators.required),  
      'testid': new FormControl('', Validators.required),  
      'year': new FormControl('', Validators.required),  
      'enddate': new FormControl('', Validators.required),  
       
      

    });  
   

   
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
       
        name: this.emp.name,
        standard: this.emp.standard,
        startdate: this.emp.startdate, 
        testid:  this.emp.testid,   
        year:  this.emp.year,  
        enddate:  this.emp.enddate,  
   
      
 
      });
      // this.key = this.data.data.key;
    
     
      this.emp.name=this.emp.name,
      this.emp.standard= this.emp.standard,
      this.emp.startdate= this.emp.startdate, 
      this.emp. testid= this.emp.testid,   
      this.emp. year=  this.emp.year,  
      this.emp.enddate=  this.emp.enddate 
      // this.selectedStandards = this.emp.standard || [];
      this.allPossibleStandards = ['UKG', 'LKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
  }
  ngOnInit() {
    this.loading = true;
    this.apiService.gettestData(this.SchoolId).subscribe(actions => {
      this.tests = actions.map(action => action.payload.doc.data() as CreateTest);
      this.loading = false; 
    },(error) => {
      console.error('Error fetching arrivals', error);
      this.loading = false; 
    });

    
  }
  
 
add(){
  this.MessageFormData;
  this.showModal?.show()
  this.emp =  new CreateTest();
 
}

deletpop(id:string){
  this.deleteModal?.show()
   this.deleteId=id;

}

save() {
   
   this.apiService.createtestData(this.emp,this.SchoolId);
    this.emp =  new CreateTest();
  this.showModal?.hide()
}


showImagePreview(imageUrl: string) {
  this.selectedPreviewImage = imageUrl;
  this.showModals1?.show(); // Show the modal
}



 update(id: string)
 {
   this.apiService.updatetestData(id.toString(),this.emp,this.SchoolId);
   this.emp = new CreateTest();
   this.editModal?.hide(); 
  
  //  this.resetForm;

 }
 
 editTest(index: number) {
  const selectedVan = this.tests[index];
  this.emp = { ...selectedVan }; // Copy selected Van data to emp object
  
  this.MessageFormData.patchValue({
    name: this.emp.name,
    // standard: this.emp.standard, // Remove this line to avoid duplicating standard values
    startdate: this.emp.startdate, 
    testid:  this.emp.testid,   
    year:  this.emp.year,  
    enddate:  this.emp.enddate,  
  });

  this.selectedStandards = [...this.emp.standard]; // Set the selected standards
  console.log(this.selectedStandards, 'check');
  this.editModal?.show();
}

delet(id: string){
  this.apiService.deletetestData(id,this.SchoolId)
  this.deleteModal?.hide()
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
    onStandardChange(standard: string): void {
      if (this.selectedStandards.includes(standard)) {
    
        this.selectedStandards = this.selectedStandards.filter(s => s !== standard);
      } else {
      
        this.emp.standard.push(standard);
      }
      console.log('Selected Standards:', this.emp.standard);
    }


    // showPreview(event: any) {
    
    //    this.uploading = true;
    //   if (event.target.files && event.target.files[0]) {
    //     const reader = new FileReader();
    //     reader.onload = (e: any) => this.imgSrc = e.target.result;
    //     reader.readAsDataURL(event.target.files[0]);
    //     this.selectedImage = event.target.files[0];
    //     this.image_path='';
    //     if (this.selectedImage != null) {
    //       var category = 'images';
    //       var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    //       const fileRef = this.storage.ref(filePath);
  
    //       this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
    //         finalize(() => {
    //           fileRef.getDownloadURL().subscribe((url) => {
    //             this.emp.pic = url;
    //             this.uploading = false;
    //           });
    //         })
    //       ).subscribe(
    //         () => {
    //           console.log('Upload completed successfully');
    //         },
    //         (error) => {
    //           console.error('Upload error:', error);
    //           this.uploading = false;
    //         }
    //       );
    //     }
  
    //   }
    //   else {
    //     this.imgSrc = '/assets/images/image_placeholder.jpg';
    //     this.selectedImage = null;
    //     this.uploading = false;
    //   }
    
    // }
    
 

}

