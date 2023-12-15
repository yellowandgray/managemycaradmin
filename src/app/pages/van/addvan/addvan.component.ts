import { Component, ViewChild } from '@angular/core';
import { Van } from '../api/addvanobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-addvan',
  templateUrl: './addvan.component.html',
  styleUrls: ['./addvan.component.scss']
})
export class AddvanComponent {
  breadCrumbItems!: Array<{}>;
  Vans: Van[] = [];
  emp: Van =new Van();
  MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  isSubmitted = false;
  files: File[] = [];
  loading: boolean = true;
  image_path: string = '';
  imgSrc: string='';
  selectedImage: any = null;
  selectedPreviewImage: string | null = null;
  deleteId:string='';
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
      'vanid': new FormControl('', Validators.required),  
      'chassis': new FormControl('', Validators.required),  
      'disel': new FormControl('', Validators.required),  
      'engno': new FormControl('', Validators.required),  
      'seats': new FormControl('', Validators.required),  
      'regno': new FormControl('', Validators.required),  
      'year': new FormControl('', Validators.required),  
      'pic': new FormControl('', ),  

    });  
   

   
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
        regno: this.emp.regno,
        chassis: this.emp.chassis,
        disel: this.emp.disel,
        engno: this.emp.engno, 
        seats:  this.emp.seats,   
        year:  this.emp.year,  
        vanid:  this.emp.vanid,  
        pic: this.emp.pic,
      
 
      });
      // this.key = this.data.data.key;
    
     

      this.emp.regno= this.emp.regno,
      this.emp.chassis=this.emp.chassis,
      this.emp.disel= this.emp.disel,
      this.emp.engno= this.emp.engno, 
      this.emp.seats=  this.emp.seats,   
      this.emp. year=  this.emp.year,  
      this.emp.vanid=  this.emp.vanid,  
      this.emp.pic= this.emp.pic
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
  }
  ngOnInit() {
    this.loading = true;
    this.apiService.getVanData(this.SchoolId,this.vanId).subscribe(actions => {
      this.Vans = actions.map(action => action.payload.doc.data() as Van);
      this.loading = false; 
    },(error) => {
      console.error('Error fetching arrivals', error);
      this.loading = false; 
    });
  }

 
add(){
  this.MessageFormData;
  this.showModal?.show()
  this.emp = new Van();
 
}

deletpop(id:string){
  this.deleteModal?.show()
   this.deleteId=id;

}

save() {
   
   this.apiService.createVanData(this.emp,this.SchoolId,this.vanId);
    this.emp = new Van();
  this.showModal?.hide()
}


showImagePreview(imageUrl: string) {
  this.selectedPreviewImage = imageUrl;
  this.showModals1?.show(); // Show the modal
}



 update(id: string)
 {
   this.apiService.updateVanData(id.toString(),this.emp,this.SchoolId,this.vanId);
   this.emp = new Van();
   this.editModal?.hide(); 
  //  this.resetForm;

 }
 
 editVan(index: number) {
  const selectedVan = this.Vans[index];
  this.emp = { ...selectedVan }; // Copy selected Van data to emp object
  
  this.MessageFormData.patchValue({
    regno: this.emp.regno,
    chassis: this.emp.chassis,
    disel: this.emp.disel,
    engno: this.emp.engno, 
    seats:  this.emp.seats,   
    year:  this.emp.year,  
    vanid:  this.emp.vanid,  
    pic: this.emp.pic,
  
  });
  this.editModal?.show();

 
}

delet(id: string){
  this.apiService.deleteVanData(id,this.SchoolId,this.vanId)
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
    
  

}
