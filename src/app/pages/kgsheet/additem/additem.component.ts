import { Component, ViewChild } from '@angular/core';
import { Additems } from '../api/additemobj';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageModalComponent } from 'src/app/Image-modal.component';




















                                                                                 
@Component({
  selector: 'app-additem',                                                  
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AddItemComponent {
  breadCrumbItems!: Array<{}>;
  additems: Additems[] = [];
  items: any[] = [];
  selectedFile: File | null = null;                                                
  downloadURL: string | null = null;
  image_path: string = "";
  imgsrc: string = "";
  selectedImage: File | null = null;
  emp: Additems = new Additems();
  MessageFormData: FormGroup;
  isSubmitted = false;
  files: File[] = [];
  imgSrc: string='';
  searchTerm: string = '';
  bsModalRef: BsModalRef | undefined;
//additems: Additems[] = [];
   kgSheetId = '3u90Jik86R10JulNCU3K';
   selectedCategory: string = '';
   //items: any[] = []; // Replace 'any' with the actual type of your data
   itemsPerPage = 30;
   currentPage = 1;
   loading: boolean = true;



   @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
   @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;








   constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage, private modalService: BsModalService) {
    this.MessageFormData = new FormGroup({  
      'id': new FormControl('', Validators.required),  
      'name': new FormControl('', Validators.required),  
      'punctuation': new FormControl('', Validators.required),
      'picture': new FormControl(''),  
      // 'active': new FormControl(''),
     
    });    
       
    if (this.emp != null) {
      this.MessageFormData.patchValue({  
        id:this.emp.id,    
        name: this.emp.name,
        punctuation: this.emp.punctuation,
      });
      this.emp.name= this.emp.name;  
      this.emp.punctuation= this.emp.punctuation;
      this.emp.id= this.emp.id;  
    }
   
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








    }
    else {
      this.imgSrc = '/assets/images/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }








  // openImageModal(imageUrl: string) {
  //   const initialState = {
  //     imageUrl: imageUrl,
  //   };








  //   this.bsModalRef = this.modalService.show(ImageModalComponent, {
  //     initialState,
  //     class: 'modal-lg',
  //   });
  // }
  openImageModal(imageUrl: string) {
    const initialState = {
      imageUrl: imageUrl,
      imageStyle: {
        'max-width': '150%',
        'max-height': '150%',
        'display': 'inline-block',
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
       
        'transform': 'translate(-50%, -50%)',
      },
    };
 
    this.bsModalRef = this.modalService.show(ImageModalComponent, { initialState });
  }
 
 
















  save() {
    const kgSheetId = '3u90Jik86R10JulNCU3K';
    if (this.selectedImage) {
             this.apiService.createAddItemData(this.emp, kgSheetId);
             this.emp = new Additems();








    } else {
      // If no file is selected, save the item data without an image.
      console.log("Else Running");
      const kgSheetId = '3u90Jik86R10JulNCU3K';
     console.log(this.emp);  
      this.apiService.createAddItemData(this.emp,kgSheetId);
       this.emp = new Additems();
       
    }
    this.MessageFormData.reset();








    this.addCourse?.hide();
  }
























































  // save() {
   
  //   //console.log(this.emp);  
  //    this.apiService.createAddItemData(this.emp,this.kgSheetId);
  //     this.emp = new Additems();
  //     this.addCourse?.hide();
     
  //  }
   delet(id: string){
   
    this.apiService.deleteAddItemData(id,this.kgSheetId)
      }








    // update(id: string)
    //   {
    //     this.apiService.updateAddItemData(id.toString(),this.emp,this.kgSheetId);
    //     this.emp = new Additems();
    //     this.deleteRecordModal?.hide();
    //     console.log(id,'id check')
    //     console.log(this.emp,'emp check')








   
    //   }








  ngOnInit() {
    // Subscribe to the address-book collection data
    this.loading= true;
    this.apiService.getAddItemData(this.kgSheetId).subscribe(actions => {
      this.additems = actions.map(action => {
        const data = action.payload.doc.data() as Additems;
        this.loading = false; 
        return {
          id:data.id,
          name: data.name,
          picture: data.picture,
          punctuation: data.punctuation
        } as Additems;
        
      }
      );
    });
























  this.addCourse?.onHidden.subscribe(() => {
    this.MessageFormData.reset();
  });








  this.deleteRecordModal?.onHidden.subscribe(() => {
    this.MessageFormData.reset();
  });








  }








  // Inside your component class
// Inside your component class








// this is for filter word contains




// filteredItems(): Additems[] {
//   if (!this.searchTerm.trim() && !this.selectedCategory) {
//     return this.additems; // If search term and category are empty, return all items
//   }




//   return this.additems.filter(item => {
//     const nameMatch = !this.searchTerm || item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase());
//     const categoryMatch = !this.selectedCategory || item.punctuation === this.selectedCategory;




//     return nameMatch && categoryMatch;
//   });
// }


// Assuming your component has properties like searchTerm, selectedCategory, additems, itemsPerPage, and currentPage.


filteredItems(): Additems[] {
  const searchTermLowerCase = this.searchTerm.trim().toLowerCase();
  const selectedCategoryLowerCase = this.selectedCategory ? this.selectedCategory.toLowerCase() : '';


  if (!searchTermLowerCase && !selectedCategoryLowerCase) {
    return this.additems; // If search term and category are empty, return all items
  }


  return this.additems.filter(item => {
    const nameMatch = !searchTermLowerCase || item.name.toLowerCase().startsWith(searchTermLowerCase);
    const categoryMatch = !selectedCategoryLowerCase || item.punctuation.toLowerCase() === selectedCategoryLowerCase;


    return nameMatch && categoryMatch;
  });
}


getVisibleItems(): Additems[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredItems().slice(startIndex, endIndex);
}


getTotalPages(): number {
  return Math.ceil(this.filteredItems().length / this.itemsPerPage);
}


getPages(): number[] {
  return Array(this.getTotalPages()).fill(0).map((_, i) => i + 1);
}






  editStudent(filteredIndex: number) {
    const originalIndex = this.additems.indexOf(this.filteredItems()[filteredIndex]);
    const selectedStudent = this.additems[originalIndex];
   
    this.emp = { ...selectedStudent };
   
    this.MessageFormData.patchValue({
      id: this.emp.id,
      name: this.emp.name,
      punctuation: this.emp.punctuation,
      picture: this.emp.picture,
    });
   
    this.deleteRecordModal?.show();








    this.deleteRecordModal?.onHidden.subscribe(() => {
      this.MessageFormData.reset();
      this.emp.picture = ''; // Reset the form when the modal is hidden
    });
  }
  update(id: string)
  {
    this.apiService.updateAddItemData(id.toString(),this.emp,this.kgSheetId);
    this.emp = new Additems();
    this.deleteRecordModal?.hide();
    console.log(id,'id check')
    console.log(this.emp,'emp check')
    this.MessageFormData.reset();
    this.deleteRecordModal?.hide();


  }


  // getVisibleItems(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.items.slice(startIndex, endIndex);
  // }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }


 










}





























