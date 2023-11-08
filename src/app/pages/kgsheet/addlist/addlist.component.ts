import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Addlist } from '../api/addlistobj';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Additems } from '../api/additemobj';
@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.scss']
})
export class AddlistComponent {
  breadCrumbItems!: Array<{}>;
  kgSheetId = '3u90Jik86R10JulNCU3K';
  addlists: Addlist[] = [];
  additems:Additems[]=[];
  selectedImage: File | null = null;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  emp: Addlist =new Addlist();
  MessageFormData: FormGroup;
  items: any[] = [];
  selectedItem: any='';

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage){

    this.MessageFormData = new FormGroup({  
      'id': new FormControl('', Validators.required),   
      'name': new FormControl('', Validators.required),   
      // 'punctuation': new FormControl('', Validators.required), 
      'picture': new FormControl(''),   
      // 'active': new FormControl(''),
     
    });    
       
    if (this.emp != null) {
      this.MessageFormData.patchValue({  
        id:this.emp.id,     
        name: this.emp.name,
       
      });
      this.emp.name= this.emp.name;  
    
      this.emp.id= this.emp.id;   
    }
    
  }


 




onFileUploaded(event:any) {
  console.log("1111111111"+event);
  console.log(event[0]);
  this.files.push(event[0]);
  console.log("222222"+this.files[0]);
  if (this.files) {
    console.log("333333333");
    const reader = new FileReader();
    const file = this.files[0];
    this.selectedImage = this.files[0];
    reader.onload = (e: any) => {
     // this.imgSrc = e.target.result;

      const imagePath = e.target.result;
     // this.imagePath.push(imagePath);

      if (this.selectedImage != null) {
        var category = 'images';
        var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);

        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.emp.picture = url;
              console.log('imagePathsdb:', this.emp.picture ); // Check if it's populated here
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
    };

    reader.readAsDataURL(file);
    this.selectedImage = file;
  }
}


save() {
  const kgSheetId = '3u90Jik86R10JulNCU3K';
  if (this.selectedImage) {
           this.apiService.createAddListData(this.emp, kgSheetId);
           this.emp = new Addlist();

  } else {
    // If no file is selected, save the item data without an image.
    console.log("Else Running");
    const kgSheetId = '3u90Jik86R10JulNCU3K';
   console.log(this.emp);  
    this.apiService.createAddListData(this.emp,kgSheetId);
     this.emp = new Addlist();
     
  }
  this.showModal?.hide();
}
// save() {
    
//     //console.log(this.emp);  
//      this.apiService.createAddListData(this.emp,this.kgSheetId);
//       this.emp = new Addlist();
//       // this.addCourse?.hide();
      
//    }

ngOnInit() {
  this.apiService.getAddListData(this.kgSheetId).subscribe(actions => {
    this.addlists = actions.map(action => {
      const data = action.payload.doc.data() as Addlist;
      return {
        id:data.id,
        name: data.name,
        picture: data.picture,
      } as Addlist;
    });
  });
  this.apiService.getAddItemData(this.kgSheetId).subscribe(actions => {
    this.additems = actions.map(action => {
      const data = action.payload.doc.data() as Additems;
      return {
        id:data.id,
        name: data.name,
        picture: data.picture,
      } as Additems;
    });
  });

}

}
