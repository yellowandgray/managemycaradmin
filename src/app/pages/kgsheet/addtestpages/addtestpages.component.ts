import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListQuestion } from '../api/listquestionsobj';
import { Addlist } from '../api/addlistobj';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Additems } from '../api/additemobj';
import { Question } from '../../gramar/api/comprehensionobj';
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';








@Component({
  selector: 'app-addtestpages',
  templateUrl: './addtestpages.component.html',
  styleUrls: ['./addtestpages.component.scss']
})
export class AddtestpagesComponent implements OnInit {
  form!: FormGroup;
  optionLabels = ['A', 'B', 'C', 'D'];
  qstn: Addlist = new Addlist();
  qstnnew: Addlist = new Addlist();
  qstnnewtest: Addlist = new Addlist();
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
loading = true;
optionNames: any = {};
index: number = 0; // Assign the appropriate initial value
option: string = '';
curr: number = 0;
selectedPreviewImage: string | null = null;
@ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;

selectedItemPictures: { [question: string]: { [category: string]: string } } = {};


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
         // console.log("List details", data);
        //  console.log("List NAme", data.items);
         
          // Assuming you want to update a property in your component with the data
          this.listDetails = data;
         
          const selectedItemIds: string[] = data.items;
          this.selectedItems = this.additems.filter(item => selectedItemIds.includes(item.id));
          this.selectedItems1 = this.additems.filter(item => selectedItemIds.includes(item.id));
          console.log("Selected Items", this.selectedItems);
          // Filtering additems based on selected item IDs
         
        this.addlists = [data];
     
         
        } else {
          console.error('No data found for the specified list ID.');




        }
   
      });
    }




   
    this.apiService.fetchQuestionsByListId(this.cur_list_id, this.kgSheetId).subscribe(
      (questions) => {
        this.qstn.questions = questions;
       
        this.qstnnew.questions = questions;
        this.qstnnewtest.questions = questions;
        this.qstn.questions.sort((a, b) => a.qno - b.qno);
        console.log('Questions:', this.qstn.questions.length);
        if (this.qstn.questions.length === 0) {
          console.log('Questions addddd:', this.qstn.questions.length);
          this.addQuestion();
        } else {
          // Iterate over each question and update option names
          this.qstn.questions.forEach((question, index) => {
            this.curr = 1;
            this.updateOptionNames(question, index);
           // this.updatePicture(question, index);
          });
        }
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
   
 
   
   
    this.addQuestion();
    this.initializeForm();
   
    this.loading = false;
  }








  initializeForm(): void {
    this.form = this.fb.group({
      questions: this.fb.array([]),
    });
  }
  addQuestion() {
    const newQuestion: ListQuestion = {
      qno: this.qstnnew.questions.length + 1,
      qstn: '',
      a: '',  // Initialize with an empty string
      b: '',  // Initialize with an empty string
      c: '',  // Initialize with an empty string
      d: '',  // Initialize with an empty string
      crtans: ''
    };
 
    this.qstnnew.questions.push(newQuestion);
  }
 








  selectItem(item: Additems): void {
    this.selectedItem = item;
    this.showDropdown = false;
  }
  onDropdownChange(index: number, option: string, event: any): void {
    const selectedItemId = (event?.target?.value || '').toString();
    console.log("dropdown change value",selectedItemId)
 //   this.qstn.questions[index][option] = selectedItemId;
  }
 
 
 
 
  filterItems(index: number, option: string, event: any): void {
    let item_name: string = '';
 
    // Set different item_name values based on the option
    if (option === 'a') {
      item_name = 'a_name';
    } else if (option === 'b') {
      item_name = 'b_name';
    } else if (option === 'c') {
      item_name = 'c_name';
    } else if (option === 'd') {
      item_name = 'd_name';
    }
 
    this.searchTerm = event.target.value.toLowerCase();
    console.log("search", this.searchTerm);
    console.log("options", option);
    this.filteredAdditems = this.selectedItems.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm)
    );
 
    const selectedItem = this.filteredAdditems.find(item => item.name === event.target.value);
    console.log("selected item ", selectedItem, index, option);
 
    this.selectedItem = selectedItem;
 
    if (this.selectedItem) {
      console.log("selected item name ", this.qstn.questions[index][option]);
      this.qstnnewtest.questions[index][option] = this.selectedItem.id;
      console.log("selected item id ", this.qstnnewtest.questions[index][option]);
      this.qstn.questions[index][item_name] = this.selectedItem.name;
      console.log("question item name",this.qstn.questions[index][item_name]);


      console.log("View image step 1");
      this.updatePicture(selectedItem, index,option );
      // Update the optionNames object with the current option name
     // this.optionNames[index][option] = item_name;
    }
  }
 
 
  removeQuestion(index: number, qstnid?: string): void {
    console.log("question id", qstnid);
 
    if (qstnid) {
      // Remove the question and associated pictures
      this.apiService.removeQuestionFromDatabase(this.kgSheetId, this.cur_list_id, qstnid);
      this.qstn.questions.splice(index, 1);
      this.qstnnew.questions.splice(index, 1);
 
      // Remove the selected pictures for the removed question
      if (this.selectedItemPictures[index]) {
        delete this.selectedItemPictures[index];
      }
    } else {
      console.error('Question ID is undefined.');
      this.qstn.questions.splice(index, 1);
      this.qstnnew.questions.splice(index, 1);
    }
   
  }
 
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'successfully saved',
      showConfirmButton: false,
      showCancelButton: true,
      timer: 1500,
    });
  }



  saveQuestions(id: string) {
     
      // console.log("step create",this.qstnnew.questions);
      // console.log("step create 2",this.qstnnew);
      // List doesn't have questions, add the new questions
      if(this.curr = 1)
      {
        console.log("updated questions",this.qstnnew)
        this.apiService.updateListQuestions(this.kgSheetId,this.qstnnew, this.cur_list_id);
        this.curr = 0;
        this.qstnnew = new Addlist();
      }
      else
      {  
        console.log("created questions",this.qstnnew)
       this.apiService.createListQuestions(this.qstnnew, this.kgSheetId, this.cur_list_id);
        this.qstnnew = new Addlist();
      }
      this.position()
   
  }

  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }


  updateOptionNames(question: any, index: number) {
    // Initialize an object to store option names for the current question
    this.optionNames[index] = {};
 
    ['a', 'b', 'c', 'd'].forEach((option) => {
      const optionId = question[option];
      if (optionId) {
        console.log("Check current ID:", optionId);
 
        // Find the item based on the ID
        const selectedItem = this.selectedItems.find(item => item.id === optionId);
 
        if (selectedItem) {
          console.log("Check current question fetch:", selectedItem);
 
          // Check if 'selectedItem.picture' is defined before accessing it
          if (selectedItem.picture) {
            // Ensure the necessary objects are initialized before setting properties
            if (!this.selectedItemPictures[index]) {
              this.selectedItemPictures[index] = {};
            }
 
            // Set the picture for the specific optionId
            this.selectedItemPictures[index][option] = selectedItem.picture;
            console.log("Current picture:", this.selectedItemPictures[index][optionId]);
          } else {
            // Handle the case where 'selectedItem.picture' is undefined
            console.error(`Picture for option ${option} is undefined for ID ${optionId}.`);
          }
        } else {
          // Handle the case where 'selectedItem' is undefined
          console.error(`No item found with ID ${optionId}.`);
        }
      }
    });
 
    console.log('Selected Item Pictures:', this.selectedItemPictures);
  }
 
 
 
 // getItemName(question.a, i, 'a')
 getItemName(itemId: string | undefined, index: number, category: string, event: any) {
  if (itemId) {
    const selectedItem = this.selectedItems.find(item => item.id === itemId);
    if (selectedItem) {
      const selectedName = selectedItem.name;
      console.log(`Option ${category} name:`, selectedName);


      // Update the optionNames object with the current option name
      this.optionNames[index][category] = selectedName;
      this.qstn.questions[index][category] = selectedName;
     
    }
  }
}




updatePicture(selectedItem: any, index: number,  category: string) {
  console.log("View image step 2");
  // Assuming you have a property to store the selected item's picture
  if (!this.selectedItemPictures[index]) {
    this.selectedItemPictures[index] = {};
  }


  // Ensure the category is defined
 


  // Update the picture for the specific category
  this.selectedItemPictures[index][category] = selectedItem ? selectedItem.picture : null;
  console.log( "curr picture",this.selectedItemPictures[index][category]);
}


handleImageError(event: any) {
  // Handle image loading errors
  console.error('Error loading image:', event);
}
}




