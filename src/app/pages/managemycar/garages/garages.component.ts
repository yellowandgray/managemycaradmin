import { Component, ViewChild } from '@angular/core';
// import { Garages, } from '../api/garageobj';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, finalize } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Question } from '../../gramar/api/comprehensionobj';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { parse } from 'date-fns';
import { ExcelService } from './excel.service';
import { Garage } from '../api/garageobj';



@Component({
  selector: 'app-garages',
  templateUrl: './garages.component.html',
  styleUrls: ['./garages.component.scss']
})
export class GaragesComponent {

  breadCrumbItems!: Array<{}>;

  deleteId:string='';
  searchTerm: string = '';
  
  filteredgarage: Garage[]=[];


 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
 
  emp: Garage = new Garage();
 
  selectedImage: any = null;
  loading: boolean = true;
  garagesdata:Garage[] = []
  MessageFormData: FormGroup;
  selectedStandard: string = '';
  image_path: string = '';
  imgSrc: string='';
 




  selectedSection: string = '';
  // searchTerm: string = '';



  
  uploading: boolean = false;
  // private readonly fileName = 'student_bulk_data_template.xlsx';



  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;

  constructor(private excelService: ExcelService,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router,private http: HttpClient ) {
    this.MessageFormData = new FormGroup({  
      'name': new FormControl('', Validators.required),   
      'address': new FormControl('', Validators.required),      
      'postcode': new FormControl('', Validators.required),      
      'about': new FormControl('', Validators.required),      
      'openinghrs': new FormControl('', Validators.required),      
      'email': new FormControl('', Validators.required), 
      'notes': new FormControl('', Validators.required), 
      'picture': new FormControl('', Validators.required), 
      'phone': new FormControl('', Validators.required),   
      'siteno': new FormControl('', Validators.required),  
      'town': new FormControl('', Validators.required),   
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {
      this.MessageFormData.patchValue({
        name: this.emp.name,
        address: this.emp.address,
        postcode: this.emp.postcode,
        about: this.emp.about,
        openinghrs: this.emp.openinghrs,
        notes: this.emp.notes,
        picture: this.emp.picture,
        phone: this.emp.phone,
        email: this.emp.email,
        siteno: this.emp.siteno,
        town: this.emp.town
      });
    
    
      this.emp.name=this.emp.name,
      this.emp.address= this.emp.address,
      this.emp.postcode= this.emp.postcode,
      this.emp.about= this.emp.about,
      this.emp.openinghrs= this.emp.openinghrs,
      this.emp.notes= this.emp.notes,
      this.emp.picture= this.emp.picture,
      this.emp.phone= this.emp.phone,
      this.emp.email= this.emp.email,
      this.emp.siteno= this.emp.siteno,
      this.emp.town= this.emp.town
    }
    
  }

  ngOnInit():void {
    this.loading = true;



    this.apiService.getGaragesData().subscribe(actions => {
      this.garagesdata = actions.map(action => action.payload.doc.data() as  Garage);
      this.filteredgarage = [...this.garagesdata];
    });
    this.loading = false;

   
}





save() {
  console.log(this.emp); 
   this.apiService.createGaragesData(this.emp);
    this.emp = new Garage();
     
  
  this.deleteRecordModal?.hide()
}






 update(id: string)
 {
   this.apiService.updateGaragesData(id.toString(),this.emp);
   this.emp = new Garage();
   this.showModals?.hide(); 
 

 }
 

 edit(index: number) {
  const selectedTeacher = this.garagesdata[index];
  this.emp = { ...selectedTeacher }; // Copy selected Teacher data to emp object
  
  this.MessageFormData.patchValue({
    name: this.emp.name,
    address: this.emp.address,
    postcode: this.emp.postcode,
    about: this.emp.about,
    openinghrs: this.emp.openinghrs,
    notes: this.emp.notes,
    picture: this.emp.picture,
    phone: this.emp.phone,
    email: this.emp.email,
    siteno: this.emp.siteno,
    town: this.emp.town
  });
  this.showModals?.show();
 
 
}





  showPreview(event: any) {
    this.uploading = true;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      console.log(this.selectedImage)
      this.image_path='';
      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              console.log(url);
              this.emp.picture = url; // Storing the URL in garage.picture
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
      this.selectedImage = null;
      this.uploading = false;
    }
  }
  



navigateToAddAppointment(data: any) {
  this.router.navigate(['/gareageavail'], { state: { garageData: data } });
}
  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
 
 
 
 
 
  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;

  }


  filteredGarage(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterGarage();
  }
 
 
  filterGarage() {
    console.log('Filtering...', this.searchTerm);


    this.filteredgarage = this.garagesdata.filter(garage => {
     
      const nameMatch = !this.searchTerm || garage.name.toLowerCase().includes(this.searchTerm.toLowerCase());


      return nameMatch;
    });


    if (!this.filteredgarage.length) {
      console.log('Nooo Students...');
      this.filteredgarage = [];
      console.log(this.filteredgarage);
    }
  }




  delet(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1',
      
      })
    };
  console.log(id)
    this.http.delete(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/Garagedelete/${id}`, httpOptions)
      .subscribe(
        () => {
          console.log('Document deleted successfully');
          this.ngOnInit()
        },
        (error) => {
          console.error('Error deleting document:', error);
          this.ngOnInit()
        }
      );
  }

  Priceinfosave(){
    this.addCourse?.hide()
}
  
add() {
  this.emp = new Garage();
  this.deleteRecordModal?.show();
}
 

onFileChange(event: any): void {
  console.log("Step 1");
  const input = event.target;
  const file = input.files[0];

  if (file) {
    this.excelService.readExcel(file).then((data: any[]) => {
        // Check if data is not null, has more than minimumRows rows, and other conditions if needed
        if (data && data.length > 0 && data.length >= 5) {
            data.forEach((student: any) => {
                const rec_no = student[0];
         
            
                if (rec_no != null && rec_no !== undefined) {  
                            
               
    
                    const studentData: Garage = {
                      // rec_no: rec_no,
                      name: student[1],
                      address: student[2],
                      postcode: student[4],
                      about: '',
                      openinghrs: '',
                      notes: '',
                      picture: '',
                      phone: student[5],
                      email: '',
                      siteno: student[0],
                      town: student[3],
                      id: ''
                    };
                    console.log("student DAta",studentData);

                    this.apiService.createGaragesData(studentData).then(
                        () => {
                            console.log('File uploaded successfully');
                        },
                        (error) => {
                            console.error('Error uploading file:', error);
                            console.log('File upload failed');
                        }
                    );
                }
                else {
                    console.error('rec_no is null or undefined in a row');
                }
            });
        } else {
            console.error('File does not meet the minimum criteria for processing');
            console.log('File upload failed');
        }
    });
}
}

}
