import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListQuestion } from '../api/listquestionsobj';
import { Addlist } from '../api/addlistobj';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Additems } from '../api/additemobj';


@Component({
  selector: 'app-addtestpages',
  templateUrl: './addtestpages.component.html',
  styleUrls: ['./addtestpages.component.scss']
})
export class AddtestpagesComponent implements OnInit {
  form!: FormGroup;
  optionLabels = ['A', 'B', 'C', 'D'];
  qstn: Addlist = new Addlist();
  addlists: Addlist[] = [];
  school_id: string = '';
  cur_list_id: string = '';
  kgSheetId = '3u90Jik86R10JulNCU3K';
  listDetails: Addlist | undefined;
  additems: Additems[]=[];
  selectedItems: Additems[]=[];
  selectedItems1: Additems[]=[];
  searchTerm: string = '';
  filteredAdditems: Additems[] = [];
  itemDetails: any[] = [];
  showAllItems: boolean = true;
  selectedIds: string[] = [];
  selectedItem: Additems | undefined;
showDropdown: boolean = false;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage) {}


  ngOnInit(): void {
    this.school_id = localStorage.getItem('school_id') ?? '';


    this.route.paramMap.subscribe((params) => {
      this.cur_list_id = params.get('id')!;
      console.log('List ID on AddTestPage:', this.cur_list_id);
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


    if (this.school_id !== '') {
      this.apiService.getAddListDataDetails(this.kgSheetId, this.cur_list_id).subscribe(data => {
        if (data ) {
          console.log("List details", data);
          console.log("List NAme", data.items);
         
          // Assuming you want to update a property in your component with the data
          this.listDetails = data;
          const selectedItemIds: string[] = data.items;
          this.selectedItems = this.additems.filter(item => selectedItemIds.includes(item.id));
          this.selectedItems1 = this.additems.filter(item => selectedItemIds.includes(item.id));
          console.log("Selected Items", this.selectedItems);
          // Filtering additems based on selected item IDs
         
          this.addlists = this.addlists = [data];
         
        } else {
          console.error('No data found for the specified list ID.');
        }
   
      });
    }






    // this.selectedItems = this.additems.filter(item => item.id.includes(item.id));


    // console.log("Selected Items", this.selectedItems);


    this.initializeForm();
    this.addQuestion();
  }


  initializeForm(): void {
    this.form = this.fb.group({
      questions: this.fb.array([]),
    });
  }
  addQuestion() {
    const newQuestion: ListQuestion = {
      qno: this.qstn.questions.length + 1,
      qstn: '',
      qtype: 'MCQA',
      a: '',
      b: '',
      c: '',
      d: '',
      crtans: ''
      
    };


    this.qstn.questions.push(newQuestion);
  }


  // onDropdownChange(index: number, selectedItemId: string): void {
  //   // Find the selected item by ID
   
  //   const selectedItem = this.additems.find(item => item.id === selectedItemId);
  //  // console.log(selectedItem);
  //   // Update the selected item for the specific dropdown
  //   if (selectedItem !== undefined) {
  //     //this.items[index] = selectedItem;
  //   } else {
  //     // Handle the case where the item is not found (optional)
  //     console.error(`Item with ID ${selectedItemId} not found.`);
  //     // You can choose to set a default or handle this case according to your application's logic.
  //   }
  // }


  // filterItems(index: number, event: any): void {
  //   this.searchTerm = event.target.value.toLowerCase();
  //   this.filteredAdditems = this.additems.filter(item =>
  //     item.name.toLowerCase().includes(this.searchTerm)
  //   );
  // }
  selectItem(item: Additems): void {
    this.selectedItem = item;
    this.showDropdown = false;
  }
 
  onDropdownChange(index: number, selectedItemId: string): void {
    // Find the selected item by ID
    const selectedItem = this.selectedItems.find(item => item.id === selectedItemId);
 
    // Update the selected item for the specific dropdown
    if (selectedItem !== undefined) {
      // Update the selectedItem in the array
      this.selectedItems[index] = selectedItem;
    } else {
      console.error(`Item with ID ${selectedItemId} not found.`);
    }
  }
 
 
  filterItems(index: number, event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
 
    // Filter the items based on the search term
    this.filteredAdditems = this.selectedItems.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm)
    );
 
    // If you need to update the selected item based on the filtered items, you can do so here
    const selectedItem = this.filteredAdditems.find(item => item.name === event.target.value);
   
    // Assuming this.selectedItem is a property in your component
    this.selectedItem = selectedItem;
  }
 
  // filterItems(index: number, event: any): void {
  //   if (this.showAllItems) {
  //     console.log("step 2");
  //     this.filteredAdditems = this.additems.filter(item =>
  //       item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
  //     );
  //   } else {
  //     console.log("step 3");
  //     this.filteredAdditems = this.additems.filter(item =>
  //       item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
  //     );
  //   }
 
  //   console.log("step 4");
  //   console.log(event.target.value);
   
  //   // Find the corresponding item in filteredAdditems based on id
  //   const selectedItem = this.filteredAdditems.find(item => item.name === event.target.value);
   
  //   if (selectedItem) {
  //     // If found, update the id and name in the items array
  //     this.itemDetails[index].id = selectedItem.id;
  //     console.log("item id",this.itemDetails[index].id);
  //     this.itemDetails[index].name = selectedItem.name;
  //     this.itemDetails[index].picture = selectedItem.picture;
  //     console.log("item name",this.itemDetails[index].name);
  //     if(selectedItem.id){
  //       this.selectedIds.push(selectedItem.id);
  //     }    
  //   } else {
  //     // Handle the case when the corresponding item is not found
  //     console.error('Item not found for id:', event.target.value);
  //   }
 
  //   // Extract only the 'id' values from filteredAdditems
  //   const idsOnly = this.filteredAdditems.map(item => item.id);
  //   console.log(idsOnly);
 
  //   // Update selectedItems based on the filtered items' IDs
  //   this.selectedItems = this.filteredAdditems;
  //   // console.log(this.selectedItems);
  // }
 
  removeQuestion(index: number): void {
    this.qstn.questions.splice(index, 1);
  }
}
