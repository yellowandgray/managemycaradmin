import { Component, OnInit } from '@angular/core';
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
loading = true;
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
        this.qstn.questions.sort((a, b) => a.qno - b.qno);
        console.log('Questions:', this.qstn.questions.length);
        if(this.qstn.questions.length === 0)
        {
          console.log('Questions addddd:', this.qstn.questions.length);
          this.addQuestion();
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
      qno: this.qstn.questions.length + 1,
      qstn: '',
      a: '',  // Initialize with an empty string
      b: '',  // Initialize with an empty string
      c: '',  // Initialize with an empty string
      d: '',  // Initialize with an empty string
      crtans: ''
    };
 
    this.qstn.questions.push(newQuestion);
  }
 




  selectItem(item: Additems): void {
    this.selectedItem = item;
    this.showDropdown = false;
  }
  onDropdownChange(index: number, option: string, event: any): void {
    const selectedItemId = (event?.target?.value || '').toString();
    this.qstn.questions[index][option] = selectedItemId;
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
 
 
 
  removeQuestion(index: number): void {
    this.qstn.questions.splice(index, 1);
  }




  // saveQuestions(id:string){
  //   this.apiService.createListQuestions(this.qstn,this.kgSheetId,id);
  // //  this.addCourse?.hide();
  //   this.qstn = new Addlist();
   
  // }


  saveQuestions(id: string) {
      console.log("step create");
      console.log("step create",this.qstn.questions);
      // List doesn't have questions, add the new questions
      this.apiService.createListQuestions(this.qstn, this.kgSheetId, this.cur_list_id);
    this.qstn = new Addlist();
  }
}


