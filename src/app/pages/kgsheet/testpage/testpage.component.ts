import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Addlist } from '../api/addlistobj';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, finalize } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Additems } from '../api/additemobj';
import { RowItem } from '../api/assignobj';
import { Assign } from '../api/assignobj ';
import { Router } from '@angular/router';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageModalComponent } from 'src/app/Image-modal.component';
@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.scss']
})
export class TestpageComponent {
  breadCrumbItems!: Array<{}>;
  kgSheetId = '3u90Jik86R10JulNCU3K';
  addlists: Addlist[] = [];
  filteredItems: Addlist[] = [];
   addlists1: Addlist[] = [];
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
 // items: any[] = [];


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
  searchTerm: string = '';
  //additems: Additems[] = [];
  filteredAdditems: Additems[] = [];
  showAllItems: boolean = true;
 
 // items: Additems[] = Array.from({ length: 10 }, () => ({ id: '', name: '', picture: '', punctuation: '' }));
  searchControl = new FormControl();
  //items: any[] = []; // your existing array
  selectedIds: string[] = [];
  selectedItems: Additems[] = [];
  currListID:string='';
  itemNames: string[] = [];
  itemDetails: any[] = [];
  allItems: Addlist[] = [];  
// filteredItems: Addlist[] = [];
selectedOption: string = '';
bsModalRef: BsModalRef | undefined;


loading: boolean = true;












  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal?: ModalDirective;
 
//  @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
  @ViewChild('deleteRecordModal2') deleteRecordModal2: any;
  @ViewChild('deleteRecordModal') deleteRecordModal: any;
 
  constructor(private router: Router,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private modalService: BsModalService)
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
   
  }
 
  ngOnInit() {
    this.loading= true;
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
            standard:data.standard,
            items:data.items
          } as Addlist;
        });
       this.allItems = this.addlists;
        this.addlists1 = this.addlists;
        this.filteredItems=this.addlists;
        console.log("Step 1", this.addlists);


          this.addlists.forEach(item => {
    console.log("Step 0: Checking item", item);
    const listId = item?.id; // Using optional chaining to avoid errors if 'id' is undefined
    console.log("Step 1.0", listId);
    this.loading = false;
    if (listId) {
      console.log("Step 1.1: Entering loop for item with id", listId);
      this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
        standards => {
          this.selectedStandards = standards[0]?.standard || [];
          console.log('Fetched standards:', this.selectedStandards);
          item.standard =this.selectedStandards;
          console.log("Step 1.2: Updated item with standards", item);
          this.loading = false;
        },
        error => {
          console.error('Error fetching standards:', error);
          this.loading = false;
        }
      );
    }
  }
  )




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
   console.log("Step 1.3");
 
 
  console.log("Step 1.2");
 // this.processAddLists();
  console.log(" After Step 1.2");
   this.filteredAdditems = this.additems;
   }


  openImageModal(imageUrl: string) {
    const initialState = {
      imageUrl: imageUrl,
      imageStyle: {
        'max-width': '100%',
        'max-height': '100%',
        'display': 'inline-block',
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
       
        'transform': 'translate(-50%, -50%)',
      },
    };
 
    this.bsModalRef = this.modalService.show(ImageModalComponent, { initialState });
  }
 
 
  navigateToAddTestPage(listId: string) {
    console.log('List ID:', listId);
    this.router.navigate(['/kgsheet/addtestpage', { id: listId }]);  
  }








   filterItems(index: number, event: any): void {
    if (this.showAllItems) {
      console.log("step 2");
      this.filteredAdditems = this.additems.filter(item =>
        item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    } else {
      console.log("step 3");
      this.filteredAdditems = this.additems.filter(item =>
        item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    }
 
    console.log("step 4");
    console.log(event.target.value);
   
    // Find the corresponding item in filteredAdditems based on id
    const selectedItem = this.filteredAdditems.find(item => item.name === event.target.value);
   
    if (selectedItem) {
      // If found, update the id and name in the items array
      this.itemDetails[index].id = selectedItem.id;
      console.log("item id",this.itemDetails[index].id);
      this.itemDetails[index].name = selectedItem.name;
      this.itemDetails[index].picture = selectedItem.picture;
      console.log("item name",this.itemDetails[index].name);
      if(selectedItem.id){
        this.selectedIds.push(selectedItem.id);
      }    
    } else {
      // Handle the case when the corresponding item is not found
      console.error('Item not found for id:', event.target.value);
    }
 
    // Extract only the 'id' values from filteredAdditems
    const idsOnly = this.filteredAdditems.map(item => item.id);
    console.log(idsOnly);
 
    // Update selectedItems based on the filtered items' IDs
    this.selectedItems = this.filteredAdditems;
    // console.log(this.selectedItems);
  }
;


  filterItemsByOption() {
    if (this.selectedOption === 'ALL' || this.selectedOption === '') {
      this.addlists = [...this.allItems];
      this.applyNameFilter(); // Apply name filtering
    } else {
      this.apiService.getListID(this.school_id, this.kgSheetId, this.selectedOption).subscribe(listIds => {
        this.addlists = this.addlists1.filter(item => listIds.includes(item.id));
        this.applyNameFilter(); // Apply name filtering
      });
    }
  }
 
  applyNameFilter() {
    // Apply name filtering
    this.filteredItems = this.addlists.filter(List => {
      const nameMatch = !this.searchTerm || List.name.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      return nameMatch;
    });
 
    if (!this.filteredItems.length) {
      console.log('No Students...');
    }
  }
 
  filteredItemsName(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterItemsByOption(); // Call the combined function
  }
 
 
 
 




 
  // filterItemsByOption() {
  //   if (this.selectedOption === 'ALL' || this.selectedOption === '') {
  //     this.addlists = [...this.allItems];
     
 
  //   } else {
     
  //     this.apiService.getListID(this.school_id, this.kgSheetId, this.selectedOption).subscribe(listIds => {
       
  //       this.addlists = this.addlists1.filter(item => listIds.includes(item.id));
 
       
  //     });
  //   }
  // }




  // filteredItemsName(event: any): void {
  //   const value = event.target.value;
  //   console.log('Filtering by name...', value);
  //   this.searchTerm = value;
  //   this.filteredItem();
  // }
 
 
  // filteredItem() {
  //   console.log('Filtering...', this.searchTerm);




  //   this.filteredItemss = this. addlists.filter(List => {
     
  //     const nameMatch = !this.searchTerm || List.name.toLowerCase().includes(this.searchTerm.toLowerCase());




  //     return nameMatch;
  //   });




  //   if (!this.filteredItems.length) {
  //     console.log('Nooo Students...');
  //     this.filteredItemss = [];
  //     console.log(this.filteredItems);
  //   }
  // }




  onDropdownChange(index: number, selectedItemId: string): void {
    // Find the selected item by ID
   
    const selectedItem = this.additems.find(item => item.id === selectedItemId);
   // console.log(selectedItem);
    // Update the selected item for the specific dropdown
    if (selectedItem !== undefined) {
      //this.items[index] = selectedItem;
    } else {
      // Handle the case where the item is not found (optional)
      console.error(`Item with ID ${selectedItemId} not found.`);
      // You can choose to set a default or handle this case according to your application's logic.
    }
  }




  // submitSelectedIds() {
  //   // console.log('Selected names:', this.items.map(item => item.id));
  //   console.log('Selected ID:', this.items.map(item => item.id));
  //   console.log('Selected ID:',this.selectedIds);
   
  //   // console.log(this.items);
   
  //  // console.log('All names:', this.localArray);
  // }






  addDetail(): void {
    this.itemDetails.push({ id: '', name: '', picture: '' }); // Modify the fields as needed
  }
 
  removeDetail(index: number): void {
    this.itemDetails.splice(index, 1);
  }
 
 
 
  addRow(): void {
   // this.items.push({ id: '', name: '', picture: '', punctuation: '' });
    this.itemDetails.push({ id: '', name: '', picture: '', punctuation: '' });
  }






  removeRow(index: number) {


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
    this.resetFilters();
  //  this.resetForm;


  }
  delete(id: string){
    const kgSheetId = '3u90Jik86R10JulNCU3K';
    this.apiService.deleteListData(id,kgSheetId)
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


save() {
  const kgSheetId = '3u90Jik86R10JulNCU3K';
  if (this.selectedImage) {
           this.apiService.createAddListData(this.emp, kgSheetId);
           this.emp = new Addlist();
           this.resetFilters();




  } else {
    // If no file is selected, save the item data without an image.
    console.log("Else Running");
    const kgSheetId = '3u90Jik86R10JulNCU3K';
   console.log(this.emp);  
    this.apiService.createAddListData(this.emp,kgSheetId);
     this.emp = new Addlist();
     this.resetFilters();
  }
  this.showModal?.hide();
}








assignSelectedStandards(): void {
  console.log("Step 0");
  this.selectedStandards.forEach(standard => {
    this.assignstd1(standard);
  });
}








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




//-




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








add(){
  this.MessageFormData;
  this.showModal?.show()
  this.emp = new Addlist();
 
}




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






resetFilters() {
  // Reset filter fields
  this.selectedOption = '';
 
  this.searchTerm = '';
 // this.filteredStudents = [...this.students];
}






// resetForm() {
//   this.selectedImage = null;
//   this.isSubmitted = false;
// }
















}



























































