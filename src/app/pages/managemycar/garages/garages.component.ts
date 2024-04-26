import { Component, ViewChild } from '@angular/core';
import { Garages, Priceinfo } from '../api/garageobj';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, finalize } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Question } from '../../gramar/api/comprehensionobj';
import { HttpClient, HttpHeaders } from '@angular/common/http';


class Garage {
  id: string='';
  name: string='';
  address: string='';
  postcode: string='';
  about: string='';
  openinghrs: string='';
  notes:string='';
  picture:string='';
  phone:string='';
  email:string='';
  siteno:string='';
  town:string='';
}

@Component({
  selector: 'app-garages',
  templateUrl: './garages.component.html',
  styleUrls: ['./garages.component.scss']
})
export class GaragesComponent {

  breadCrumbItems!: Array<{}>;

  deleteId:string='';


  garage: Garage = {
    id:'',
    name: '',
    address: '',
    postcode: '',
    about: '',
    openinghrs: '',
    notes:'',
    picture:'',
    phone:'',
    email:'',
    town:'',
    siteno:''
  };

 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
 

 
  selectedImage: any = null;
  loading: boolean = true;
  garagesdata:any;

  selectedStandard: string = '';
  image_path: string = '';
  imgSrc: string='';
 




  selectedSection: string = '';
  searchTerm: string = '';



  
  uploading: boolean = false;
  // private readonly fileName = 'student_bulk_data_template.xlsx';



  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router,private http: HttpClient ) {
   
  }

  ngOnInit():void {
    this.loading = true;

    // getGaragesData

    this.apiService.getGaragesData().subscribe(actions => {
      this.garagesdata = actions.map(action => action.payload.doc.data() );
    });
    this.loading = false;
    // this.apiService.getGaragesData().subscribe(
    //     (data) => {
    //         console.log(data);
    //         this.garagesdata = data;
    //         console.log(this.garagesdata)
    //         this.loading = false;
    //     },
    //     (error) => {
    //         console.error('Error fetching garages: ', error);
    //         this.loading = false;
    //     }
    // );

    // this.addNewGarage();
}




  submitForm() {
    const formData = {
      name: this.garage.name,
      address: this.garage.address,
      postcode: this.garage.postcode,
      about: this.garage.about,
      openinghrs: this.garage.openinghrs,
      notes: this.garage.notes,
      phone: this.garage.phone,
      email: this.garage.email,
      siteno: this.garage.siteno,
      town: this.garage.town,
      picture: this.garage.picture // Use the URL obtained from Firebase Storage
    };
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1',
        'Content-Type': 'application/json'
      })
    };
  
    this.http.post('https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createGarage',formData, httpOptions)
      .subscribe(
        (response) => {
          console.log('Success:', response);
          this.deleteRecordModal!.hide();
          this.ngOnInit()
        },
        (error) => {
          console.error('Error:', error);
          this.deleteRecordModal!.hide();
          this.ngOnInit()
        }
      );
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
              this.garage.picture = url; // Storing the URL in garage.picture
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
  


//   navigateToAddAppointment(data: any) {
   
//     this.router.navigate(['/gareageavail', data]);
// }
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

 

  edit(garage: Garage) {
   console.log(garage)
   this.garage = { ...garage }; 
    console.log(this.garage);
    this.showModals?.show();  
}

update(id: string) {
  console.log(id);
  const formData = {
    name: this.garage.name,
    address: this.garage.address,
    postcode: this.garage.postcode,
    about: this.garage.about,
    openinghrs: this.garage.openinghrs,
    notes: this.garage.notes,
    phone: this.garage.phone,
    email: this.garage.email,
    siteno: this.garage.siteno,
    town: this.garage.town,
    picture: this.garage.picture // Use the URL obtained from Firebase Storage
  };

  // Log formData for debugging
  console.log(formData);

  // Define HTTP options including headers
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer api-token-1',
      'Content-Type': 'application/json'
    })
  };

  // Send HTTP PUT request with updated formData
  this.http.put(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/Garageupdate/${id}`, formData, httpOptions)
    .subscribe(
      (response: any) => {
        console.log('Success:', response);
   
        this.showModals?.hide();
        this.ngOnInit();
      },
      (error) => {
        console.error('Error:', error);
     
        this.showModals?.hide();
        this.ngOnInit();
      }
    );
   this.showModals?.hide()
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
  this.garage = new Garage();
  this.deleteRecordModal?.show();
}
 
 



}
