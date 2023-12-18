import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension, Question, Vocabulary } from '../api/comprehensionobj';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { array } from '@amcharts/amcharts5';
import { Assign } from '../api/assignobj ';
import { Subscription, finalize } from 'rxjs';




@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent {
  breadCrumbItems!: Array<{}>;
  comprehensions: Comprehension[] = [];
  filteredItems: Comprehension[] = [];
  allItems: Comprehension[] = [];
  addlists1: Comprehension[] = [];
  image_path: string = '';
  selectedImage: any = null;
  imgSrc: string='';
  emp: Comprehension = new Comprehension();
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  form: FormGroup | undefined;
 
  MessageFormData: FormGroup;
  questions: Question[] = [];
 // MessageFormData: FormGroup;
 assignForm: FormGroup;
 selectedStandards: string[] = [];
 selectedItemId: string ='';
 standardsList: string[] = ['UKG','LKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
 allPossibleStandards: string[] = [];
 fetchedStandards: string[] = [];
 assign: Assign =new Assign();
 assignid: string ='';
 fetchedStandards1: string[] = [];
 filteredAdditems: Vocabulary[] = [];
 vocabularyData: Vocabulary[] = [];
 showAllItems: boolean = true;

 selectedOption: string = '';
 searchTerm: string = '';
 dataSubscription: Subscription | null = null;
 school_id: string = 'stZWDh06GmAGgnoqctcE';
 kgSheetId = '3u90Jik86R10JulNCU3K';
 deleteId:string='';

 itemDetails: any[] = [];
 selectedIds: string[] = [];
 selectedKeyWords: Set<string> = new Set<string>();
 selectedKeywords1: string[] = [];
 selectedItems: Vocabulary[] = [];
 currListID:string='';
 selectedPreviewImage: string | null = null;

 @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
@ViewChild('keywordModal', { static: false }) keywordModal?: ModalDirective;
// @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
@ViewChild('deleteRecordModal2') deleteRecordModal2: any;
@ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private formBuilder: FormBuilder,private fb: FormBuilder) {
  //  this.MessageFormData = new FormGroup({  
  //   'no': new FormControl('', Validators.required),  
  //   'title': new FormControl('', Validators.required),      
  //   'paragraph': new FormControl('', Validators.required),
  //   'questions': new FormControl([])
  //   });
  this.MessageFormData = this.formBuilder.group({
    'no': ['', Validators.required],
    'title': ['', Validators.required],
    'paragraph': ['', Validators.required],
    'questions': this.formBuilder.array([]) // FormArray for questions
  });this.assignForm = new FormGroup({
    'standard': new FormControl([]),
  });
 
 
 


 
  if (this.emp != null) {
    this.MessageFormData.patchValue({  
      id:this.emp.id,    
      no: this.emp.no,
      title: this.emp.title,
      paragraph: this.emp.paragraph,
     questions:this.emp.questions


    });
    this.emp.no= this.emp.no;  
    this.emp.title= this.emp.title;
    this.emp.id= this.emp.id;
    this.emp. paragraph =this.emp.paragraph;
    this.emp. questions =this.emp.questions;
    this.allPossibleStandards = ['UKG','LKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  } }
 
 
  
  // ngOnInit() {
  //   // this.loading= true;
  //   this.dataSubscription = this.apiService.getComprehensionData(this.GrammarId).subscribe(
  //     (actions) => {
  //       this.comprehensions = actions.map((action) => action.payload.doc.data() as Comprehension);
  //       // this.comprehensions.sort((a, b) => a.title.localeCompare(b.title));
  //       this.filteredItems = [...this.comprehensions];
  //       this.allItems=  this.comprehensions;
  //       this.comprehensions.forEach(item => {
  //         const listId = item?.id; // Using optional chaining to avoid errors if 'id' is undefined
         
  //         if (listId) {
  //           this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
  //             standards => {
  //               this.selectedStandards = standards[0]?.standard || [];
  //               item.standard =this.selectedStandards;
                
  //             },
  //             error => {
  //               console.error('Error fetching standards:', error);
               
  //             }
  //           );
  //         }
  //       })
        
  //     },);

  // }
  ngOnInit() {
    // this.loading= true;
    this.dataSubscription = this.apiService.getComprehensionData(this.GrammarId).subscribe(
      (actions) => {
        this.comprehensions = actions.map((action) => action.payload.doc.data() as Comprehension);
        // this.comprehensions.sort((a, b) => a.title.localeCompare(b.title));
        this.filteredItems = [...this.comprehensions];
        this.allItems=  this.comprehensions;
        this.comprehensions.forEach(item => {
          const listId = item?.id; // Using optional chaining to avoid errors if 'id' is undefined
         
          if (listId) {
            this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
              standards => {
                this.selectedStandards = standards[0]?.standard || [];
                item.standard =this.selectedStandards;
               
              },
              error => {
                console.error('Error fetching standards:', error);
               
              }
            );
          }
        })
       
      },);


      this.apiService.getVocabularyData(this.GrammarId).subscribe(actions => {
        this.vocabularyData = actions.map(action => {
          const data = action.payload.doc.data() as Vocabulary;
       //   console.log("All Vocabulary DAta", data);


          return {
            id:data.id,
            name: data.name,
            pic: data.pic,
            desc:data.desc
          } as Vocabulary;
        });
        console.log("All Vocabulary DAta", this.vocabularyData);
      });
    //  console.log("All Vocabulary DAta", this.vocabularyData.values);
      this.filteredAdditems = this.vocabularyData;
  }




  addQuestion() {
    const newQuestion: Question = {
      qno: this.emp.questions.length + 1,
      qstn: '',
      qtype: 'MCQA',
      a: '',
      b: '',
      c: '',
      d: '',
      answer: ''
    };
 
    this.emp.questions.push(newQuestion);
  }
 
 
 
 
  get questionsForm() {
    return this.MessageFormData.get('questions') as FormArray;
  }
 
 
  get questionsFormArray() {
    return this.MessageFormData.get('questions') as FormArray;
  }
 




save(id:string){
  this.apiService.createComprehensionQuestions(this.emp,this.GrammarId);
  this.addCourse?.hide();
  this.emp = new Comprehension();
 
}



editComprehension(index: number) {
  this.deleteRecordModal?.show(); 
  const selectedComprehension = this.comprehensions[index];

  if (selectedComprehension) {
    this.emp = { ...selectedComprehension };
    this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {

      this.emp.questions = actions.map(action => action.payload.doc.data() as any);

      if (this.emp.questions) {
        const questionFormArray = this.emp.questions.map((question: any) => {
          return this.fb.group({
            id: [question.id],
            qno: [question.qno],
            qstn: [question.qstn],
            qtype: [question.qtype],
            a: [question.a],
            b: [question.b],
            c: [question.c],
            d: [question.d],
            answer: [question.answer]
          });
        });

        this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));

        this.MessageFormData.patchValue({
          id: this.emp.id,
          no: this.emp.no,
          title: this.emp.title,
          paragraph: this.emp.paragraph,
        });

       // Move the show() call here

        this.deleteRecordModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    });
  }
}

editComprehension1(index: number) {
  this.keywordModal?.show();
  const selectedComprehension = this.comprehensions[index];


  if (selectedComprehension) {
    this.emp = { ...selectedComprehension };
    this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {


      this.emp.questions = actions.map(action => action.payload.doc.data() as any);


      if (this.emp.questions) {
        const questionFormArray = this.emp.questions.map((question: any) => {
          return this.fb.group({
            id: [question.id],
            qno: [question.qno],
            qstn: [question.qstn],
            qtype: [question.qtype],
            a: [question.a],
            b: [question.b],
            c: [question.c],
            d: [question.d],
            answer: [question.answer]
          });
        });


        this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));


        this.MessageFormData.patchValue({
          id: this.emp.id,
          no: this.emp.no,
          title: this.emp.title,
          paragraph: this.emp.paragraph,
        });


       // Move the show() call here


        this.keywordModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    });
  }
}


editListItemId(id: string) {
  this.currListID = id;
  console.log("Current List Id", this.currListID);
  const existingData = this.comprehensions.find(item => item.id === id);
  console.log("existing Data keywords length",existingData);
  if (existingData) {
 
    console.log('Data already exists:', existingData);
   
    this.itemDetails = existingData.keywords.map( itemname=> {
      this.selectedIds.push(itemname);
      console.log("items Name : ",itemname);
      const item = this.vocabularyData.find(item => item.name === itemname);
      console.log("vocabulary data ",this.vocabularyData);
      console.log("items Name : ",item?.name);
     
      return item ? { id: item.id, name: item.name || '', pic: item.pic || '', desc: item.desc||'' } : null;
    });
    if(this.itemDetails.length==0)
    {
      this.itemDetails= Array.from({ length: 4 }, () => ({ id: '', name: '', pic: '', desc: '' }));
    }
    console.log('Item Details:', this.itemDetails);






    // You can show a different modal or handle the behavior as needed
  } else {
    // Data is new, perform actions accordingly
    console.log('Data is new');
    this.currListID = id;
    console.log("Current List Id", this.currListID);
    // Show your existing modal or handle the behavior as needed
  }
}






updateQuestions() {
  const questionFormArray = this.emp.questions.map((question: any) => {
    return this.fb.group({
      id: [question.id],
      qno: [question.qno],
      qstn: [question.qstn],
      qtype: [question.qtype],
      a: [question.a],
      b: [question.b],
      c: [question.c],
      d: [question.d],
      answer: [question.answer],
    });
  });

  this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
  
}



updateKeyWord(id: string): void {
  // Filter out items with empty names and then extract names from itemDetails array
  this.selectedKeywords1 = this.itemDetails
    .filter(item => item.name.trim() !== '')  // Exclude items with empty names
    .map(item => item.name);


  // Check if the array is not empty before proceeding
  if (this.selectedKeywords1.length === 0) {
    console.log('No non-empty keywords selected. Skipping update.');
    return;
  }


  // Use selectedKeywords1 array as needed (e.g., update in Firebase)


  console.log('Updated Keywords:', this.selectedKeywords1);


  this.apiService.updateComprehensionKeyWords(id.toString(), this.selectedKeywords1, this.GrammarId);
  this.keywordModal?.hide();
 // this.emp1 = new Vocabulary();
  // ... existing code ...
}

update(id: string) {

  this.updateQuestions();
  const updatedQuestions = this.MessageFormData.value.questions.map((question: any) => {
    return {
      id: question.id,
      qno: question.qno,
      qstn: question.qstn,
      qtype: question.qtype,
      a: question.a,
      b: question.b,
      c: question.c,
      d: question.d,
      answer: question.answer,
    };
  });

  this.emp.questions = updatedQuestions;

  this.apiService.updateComprehensionData(id.toString(), this.emp, this.GrammarId);

  this.emp = new Comprehension();
  this.deleteRecordModal?.hide();
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
            console.log('imagePathsdb:', this.emp.pic ); // Check if it's populated here
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

delet(id: string){
  this.apiService.quarydeleteComprehensionData(this.GrammarId,id)
  this.deleteModal?.hide()

}


   
   add(){
    this.MessageFormData;
    this.addCourse?.show()
    this.emp = new Comprehension();
   
  }
  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }

//assign



setSelectedItemId(itemId: string) {
  this.selectedItemId = itemId;
  this.assign.list_id = this.selectedItemId;

}

assignstd1(listId: string): void {


  // Assuming listId is set when the "Assign to Standard" button is clicked
  if (!listId) {
    console.error('List ID not provided.');
    return;
  }

  // Fetch the entire document for the clicked list_id
  this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
    assignedData => {


      // Extract the 'standard' field or any other field you need
      this.selectedStandards = assignedData[0]?.standard || [];
      this.assignid = assignedData[0]?.id;
      // Update fetchedStandards only if assignedData[0] is defined
      this.fetchedStandards = assignedData[0]?.standard || [];
      this.fetchedStandards1 = assignedData[0]?.standard;

 // Set the selectedItemId
      this.setSelectedItemId(listId);
    },
    error => {
      // Handle the case where the list ID does not exist
      console.error('Error fetching document data:', error);


      // Reset selectedStandards to an empty array
      this.selectedStandards = [];

      // Set the selectedItemId
      this.setSelectedItemId(listId);

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
}

saveSelectedStandards() {
  this.assign.list_id = this.selectedItemId;
  this.assign.standard = this.selectedStandards;
    if ( this.fetchedStandards1 != null) {
     // this.assign.standard = this.selectedStandards;
      this.apiService.updateAssignData(this.assign, this.school_id, this.assignid );
      this.assign = new Assign();
      this.deleteRecordModal2.hide();
   
    } else {
      this.apiService.createAssignData(this.assign, this.school_id);
      this.assign = new Assign();
      this.deleteRecordModal2.hide();
     
    }

 
}
signSelectedStandards(): void {
  this.selectedStandards.forEach(standard => {
    this.assignstd1(standard);
  });
}

filterItems(index: number, event: any): void {
  if (this.showAllItems) {
    console.log("step 2");
    this.filteredAdditems = this.vocabularyData.filter(item =>
      item.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
    );
  } else {
    console.log("step 3");
    this.filteredAdditems = this.vocabularyData.filter(item =>
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
    this.itemDetails[index].pic = selectedItem.pic;
    this.itemDetails[index].desc = selectedItem.desc;
    console.log("item name",this.itemDetails[index].name);
    console.log("item picture",this.itemDetails[index].pic);
    if(selectedItem.id){
      this.selectedIds.push(selectedItem.name);
      this.selectedKeyWords.add(event.target.value);
     
      console.log("Selected Keywords Name", this.selectedIds)
    }    
  } else {
    // Handle the case when the corresponding item is not found
    console.error('Item not found for id:', event.target.value);
  }

  this.selectedItems = this.filteredAdditems;

}

onDropdownChange(index: number, selectedItemId: string): void {
  // Find the selected item by ID
 
  const selectedItem = this.vocabularyData.find(item => item.name === selectedItemId);
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


addRow(): void {
  // this.items.push({ id: '', name: '', picture: '', punctuation: '' });
   this.itemDetails.push({ id: '', name: '', pic: '', desc: '' });
 }



filterItemsByOption() {
  if (this.selectedOption === 'ALL' || this.selectedOption === '') {
    this.comprehensions = [...this.allItems];
    this.applyNameFilter(); // Apply name filtering
  } else {
    this.apiService.getListID(this.school_id, this.kgSheetId, this.selectedOption).subscribe(listIds => {
      this.comprehensions = this.allItems.filter(item => listIds.includes(item.id));
      this.applyNameFilter(); // Apply name filtering
    });
  }
}

applyNameFilter() {
  // Apply name filtering
  this.filteredItems = this.comprehensions.filter(List => {
    const nameMatch = !this.searchTerm || List.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    return nameMatch;
  });

  if (!this.filteredItems.length) {
  }
}
filteredItemsName(event: any): void {
  const value = event.target.value;
  this.searchTerm = value;
  this.filterItemsByOption(); // Call the combined function
}

deletpop(id:string){
  this.deleteModal?.show()
   this.deleteId=id;

}
 
}



