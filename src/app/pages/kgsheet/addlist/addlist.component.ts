import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Addlist } from '../api/addlistobj';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Additems } from '../api/additemobj';
import { RowItem } from '../api/assignobj';
import { Assign } from '../api/assignobj ';
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
  assign: Assign =new Assign();
  MessageFormData: FormGroup;
  //MessageFormData1: FormGroup;
  items: any[] = [];
  
  selectedItem: any='';
  additem: any[] = []; // Your array of items
  item: RowItem[] = []; // Array to store rows
  image_path: string = "";
  imgSrc: string = "";
  data: any;
  selectedItemId: string =''; 
  school_id: string = '';
  assignid: string ='';
  standardsList: string[] = ['UKG', 'LKG', 'I', 'II', 'III']; // Add more standards as needed
  selectedStandards: string[] = [];
  assignForm: FormGroup;
  fetchedStandards: string[] = [];
  fetchedStandards1: string[] = [];
  allPossibleStandards: string[] = [];

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal?: ModalDirective;
  
//  @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
  @ViewChild('deleteRecordModal2') deleteRecordModal2: any;


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage)
  {
   

    this.MessageFormData = new FormGroup({  
      'id': new FormControl('', Validators.required),   
      'name': new FormControl('', Validators.required),   
      'picture': new FormControl(''),   
    });   
    this.assignForm = new FormGroup({
      'standard': new FormControl([]),
    }); 

    
       
    if (this.emp != null) {
      this.MessageFormData.patchValue({  
        id:this.emp.id,     
        name: this.emp.name,
       list_id:this.emp.id,
       items:[] = [],
       
      });
      this.emp.name= this.emp.name;    
      this.emp.id= this.emp.id;   
      this.emp.list_id= this.emp.list_id;  
      this.allPossibleStandards = ['LKG', 'UKG', 'I', 'II', 'III'];

    }

    // this.MessageFormData1 = new FormGroup({                                                                                                                                                                                                                                                                                                                                                            
    //   'list_id': new FormControl('', Validators.required),    
    // });    
       
    // if (this.assign != null) {
    //   this.MessageFormData1.patchValue({  
    //     list_id:this.emp.id,           
    //   });   
    //   this.assign.list_id= this.emp.id;   
    // }
    
  }
  
  ngOnInit() {
    this.school_id = localStorage.getItem('school_id')??'';
    if(this.school_id!='')
    {
     this.apiService.getAddListData(this.kgSheetId).subscribe(actions => {
       this.addlists = actions.map(action => {
         const data = action.payload.doc.data() as Addlist;
         return {
           id:data.id,
           name: data.name,
           picture: data.picture,
           standard:data.standard
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

   editList(index: number) {
    const selectedList = this.addlists[index];
    this.emp = { ...selectedList }; // Copy selected student data to emp object
    
    this.MessageFormData.patchValue({
     
      name: this.emp.name,
      picture: this.emp.picture,
     
    });
    this.editModal?.show();
   // this.resetForm
   
  }

  update(id: string)
  {
    const kgSheetId = '3u90Jik86R10JulNCU3K';
    this.apiService.updateListData(id.toString(),this.emp,kgSheetId);
    this.emp = new Addlist();
    this.editModal?.hide(); 
    this.resetForm;

  }
  delet(id: string){
    const kgSheetId = '3u90Jik86R10JulNCU3K';
    this.apiService.deleteStudentData(id,kgSheetId)
      }

 // Add this property to your component



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


assignstd()
{ 
 
  
}
assignSelectedStandards(): void {
  console.log("Step 0");
  this.selectedStandards.forEach(standard => {
    this.assignstd1(standard);
  });
}

//selectedStandards: string[] = [];

// assignstd1(standard: string): void {

//   if (this.assign.standard.includes(standard)) {
//     // If standard is already selected, remove it
//     this.assign.standard = this.assign.standard.filter(item => item !== standard);
//   } else {
//     // If standard is not selected, add it to the list
//     this.assign.standard.push(standard);
//   }
// }
isSelected(standard: string): boolean {
  return this.assign.standard.includes(standard);
}

setSelectedItemId(itemId: string) {
  this.selectedItemId = itemId;
  this.assign.list_id = this.selectedItemId;
  console.log("school id: " + this.school_id);
  console.log("Item id: " + itemId);

  // this.apiService.checkListIdExists(this.school_id, itemId).subscribe(
  //   response => {
  //     console.log("API Response: ", response[0].id);
  //     // Do something with the API response, if needed
  //   },
  //   error => {
  //     console.error("API Error: ", error);
  //     // Handle API error, if needed
  //   }
  // );
}

assignstd1(listId: string): void {
  console.log("Step 0.1");

  // Assuming listId is set when the "Assign to Standard" button is clicked
  if (!listId) {
    console.error('List ID not provided.');
    return;
  }

  // Fetch the entire document for the clicked list_id
  this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
    assignedData => {
      console.log("Step 1");

      // Extract the 'standard' field or any other field you need
      this.selectedStandards = assignedData[0]?.standard || [];
      this.assignid = assignedData[0]?.id;
      console.log("Assign ID" +this.assignid);
      // Update fetchedStandards only if assignedData[0] is defined
      this.fetchedStandards = assignedData[0]?.standard || [];
      this.fetchedStandards1 = assignedData[0]?.standard;


      // Show the modal
    //  this.deleteRecordModal2.show();

      // Set the selectedItemId
      this.setSelectedItemId(listId);
    },
    error => {
      // Handle the case where the list ID does not exist
      console.error('Error fetching document data:', error);

      // Reset selectedStandards to an empty array
      this.selectedStandards = [];

      // Show the modal
     // this.deleteRecordModal2.show();

      // Set the selectedItemId
      this.setSelectedItemId(listId);

      // Set fetchedStandards to an empty array if no data is fetched
      this.fetchedStandards = [];
    }
  );
}
onStandardChange(standard: string): void {
  if (this.selectedStandards.includes(standard)) {
    // Remove standard if already selected
    this.selectedStandards = this.selectedStandards.filter(s => s !== standard);
  } else {
    // Add standard if not selected
    this.selectedStandards.push(standard);
  }
  console.log('Selected Standards:', this.selectedStandards);
}







// saveSelectedStandards() {

//   if (this.selectedItemId) {
//     // Your logic here, using this.selectedItemId
//     console.log("Selected item id:", this.selectedItemId);
//     this.assign.list_id = this.selectedItemId
//     const schoolid1 = localStorage.getItem('school_id');
//   const schoolid = "stZWDh06GmAGgnoqctcE";

//     this.apiService.createAssignData(this.assign,schoolid);
//      this.assign = new Assign();
//      this.deleteRecordModal2?.hide();
//   } else {
//     console.error("No item selected.");
//   }
  
//   this.showModal?.hide();
// }






saveSelectedStandards() {
  this.assign.list_id = this.selectedItemId;
  this.assign.standard = this.selectedStandards;
  console.log("enter into save");
    if ( this.fetchedStandards1 != null) {
      console.log("Update a Assign Data");
     // this.assign.standard = this.selectedStandards;
      this.apiService.updateAssignData(this.assign, this.school_id, this.assignid ); 
      this.assign = new Assign();
      this.deleteRecordModal2.hide();
    
    } else {
      console.log("Create a New Assign Data");   
      this.apiService.createAssignData(this.assign, this.school_id);
      this.assign = new Assign();
      this.deleteRecordModal2.hide();
     
    }

    // Reset the form and close the modal
    // this.assign = new Assign();
    // this.deleteRecordModal2?.hide();
    // this.showModal?.hide();
  
}


// save() {
    
//     //console.log(this.emp);  
//      this.apiService.createAddListData(this.emp,this.kgSheetId);
//       this.emp = new Addlist();
//       // this.addCourse?.hide();
      
//    }


addRow() {
  // Create a new RowItem object and push it to the items array
  const newRow: RowItem = {
    selectedOption: this.selectedItem,
    picture: this.selectedItem?.picture
  };
  console.log(newRow,'check')
  this.items.push(newRow);
  console.log(newRow,'check')
}

resetForm() {
  this.selectedImage = null;
  this.isSubmitted = false;
}

}
