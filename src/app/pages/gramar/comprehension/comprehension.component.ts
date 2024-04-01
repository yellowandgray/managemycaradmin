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
import { Score } from '../../address-book/api/scoreobj';
















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
 filteredData: Vocabulary[] = [];
 empKeywords: string[] = [];
 selectedEmp: any;




 selectedOption: string = '';
 searchTerm: string = '';
 dataSubscription: Subscription | null = null;
 school_id: string = 'stZWDh06GmAGgnoqctcE';
 kgSheetId = '3u90Jik86R10JulNCU3K';
 SchoolId:string='stZWDh06GmAGgnoqctcE';
  ScoreId:string='4UwpeVOx1X4YofEWx3jq';
 deleteId:string='';
 score:Score[]=[];
 scoreform:Score[]=[];




 itemDetails: any[] = [];
 itemDetailsNew: any[] = [];
 selectedIds: string[] = [];
 selectedKeyWords: Set<string> = new Set<string>();
 selectedKeywords1: string[] = [];
 selectedItems: Vocabulary[] = [];
 newVocabulary1: Vocabulary = new Vocabulary();
 newVocabulary:Vocabulary[] = [];
 currListID:string='';
 selectedPreviewImage: string | null = null;




 @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
@ViewChild('keywordModal', { static: false }) keywordModal?: ModalDirective;
// @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
@ViewChild('deleteRecordModal2') deleteRecordModal2: any;
@ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
@ViewChild('compDetailsModal', { static: false }) compDetailsModal?: ModalDirective;








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
        this.filteredData = [...this.vocabularyData];
       // this.filterTable();
      });
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




showPreview1(event: any, index: number) {
  console.log("step 0");




  if (event.target.files && event.target.files[0]) {
    console.log("Step 1");
    const reader = new FileReader();
   
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
      console.log("Step 2");
    };




    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage = event.target.files[0];
    this.image_path = '';




    if (this.selectedImage != null) {
      console.log("Step 3");
      var category = 'images';
      var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);




      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().toPromise().then((url) => {
            // Update the itemDetails array with the new image URL
            this.itemDetails[index].pic = url;
            this.itemDetailsNew[index].pic = url;
            console.log("Step 4");
            console.log('imagePathsdb1:', this.itemDetails[index].pic);
            console.log("All Item Details after image upload", this.itemDetails);
            // Check if it's populated here
          }).catch(error => {
            console.log("Step 6");
            console.error('Download URL error:', error);
          });
        })
      ).subscribe(
        () => {
          console.log("Step 5");
          console.log('Upload completed successfully');
          console.log("All Item Details after image upload", this.itemDetails);
        },
        (error) => {
          console.log("Step 6");
          console.error('Upload error:', error);
        }
      );
    }
  } else {
    console.log("Step 7");
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



updateKeyWord(id: string): void {
  console.log("final keywords item Details", this.itemDetails);




  // Filter items in itemDetails with non-empty names and empty ids
  this.newVocabulary = this.itemDetails.filter(item => item.name.trim() !== '' && item.id === '');




  console.log("final keywords item Details New", this.newVocabulary);




  // Extract names from all non-empty items in itemDetails
  this.selectedKeywords1 = this.itemDetails
    .filter(item => item.name.trim() !== '')  // Exclude items with empty names
    .map(item => item.name);




  if (this.selectedKeywords1.length === 0) {
    console.log('No non-empty keywords selected. Skipping update.');
    return;
  }




  console.log('Updated Keywords:', this.selectedKeywords1);




  // If there are items in newVocabulary, create a newVocabulary1 object
  if (this.newVocabulary.length > 0) {
    for (const vocabItem of this.newVocabulary) {
      const newVocabulary1: Vocabulary = {
        id: vocabItem.id,
        name: vocabItem.name,
        pic: vocabItem.pic,
        desc: vocabItem.desc,
      };
 
      console.log("new Vocabulary", newVocabulary1);
      this.apiService.createVocabularyData1(newVocabulary1, this.GrammarId);
    }
  }
 




  // Call your API services as needed
  // this.apiService.createVocabularyData1(this.newVocabulary1, this.GrammarId);
   this.apiService.updateComprehensionKeyWords(id.toString(), this.selectedKeywords1, this.GrammarId);




  // Hide the modal
  this.keywordModal?.hide();
}








signSelectedStandards(): void {
  this.selectedStandards.forEach(standard => {
    this.assignstd1(standard);
  });
}




filterItems(index: number, event: any): void {
  console.log("step 4");
 








 console.log("event value",this.itemDetails[index].name);




  // Find the corresponding item in vocabularyData based on the selected name
  const selectedItem = this.vocabularyData.find(item => item.name === event.target.value);




  if (selectedItem) {
    // If found, update the id and name in the itemDetails array
    this.itemDetails[index].id = selectedItem.id;
    this.itemDetails[index].name = selectedItem.name;
    this.itemDetails[index].pic = selectedItem.pic;
    this.itemDetails[index].desc = selectedItem.desc;
    console.log("item id", this.itemDetails[index].id);
    console.log("item name", this.itemDetails[index].name);
    console.log("item picture", this.itemDetails[index].pic);
   
    if (selectedItem.id) {
      this.selectedIds.push(selectedItem.name);
      this.selectedKeyWords.add(event.target.value);
      console.log("Selected Keywords Name", this.selectedIds);
    }
  } else {
    // If not found, reset the id, name, pic, and desc to empty values
   
    this.itemDetails[index].id = '';
    this.itemDetails[index].name = event.target.value;
    this.itemDetailsNew[index].name = event.target.value;
    this.itemDetails[index].pic = '';
    this.itemDetails[index].desc = '';
    console.error('Item not found for name:', event.target.value);
    console.log("new vocabulary data ", this.itemDetails[index].name)
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




filterItems1(index: number, event: any): void {
 
  this.itemDetails[index].desc = event.target.value;
  console.error('item desc',this.itemDetails[index].desc);
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




// new code








// Your component code...




isItemInVocabulary(itemName: string): boolean {
  return this.vocabularyData.some(item => item.name === itemName);
}




showUploaderForItem(item: any): boolean {
  return item.name !== '' && !this.isItemInVocabulary(item.name);
}




// Your component code...


editComprehensionDetails1(compId: string, index: number) {








  this.compDetailsModal?.show();




  const selectedComprehension = this.comprehensions.find((d) => d.id === compId);
  this.apiService.getScoreData(this.SchoolId, this.ScoreId).subscribe(actions => {
    this.score = actions.map(action => action.payload.doc.data() as Score);
   // this.score = this.score.filter(score => score.stuid === this.studentid);
  //  this.scoreform = this.score.filter(score => score.compid === compId);
  });




  if (selectedComprehension) {
    this.emp = { ...selectedComprehension };




    if (this.emp.questions) {








      const question = this.emp.questions[index];
      const isQuestionAlreadyAdded = this.MessageFormData.value.questions.some(
        (q: any) => q.id === question.id
      );




      if (!isQuestionAlreadyAdded) {
        const questionFormArray = this.fb.group({
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




        this.MessageFormData.setControl(
          'questions',
          this.fb.array([...this.MessageFormData.value.questions, questionFormArray])
        );




        this.MessageFormData.patchValue({
          id: this.emp.id,
          no: this.emp.no,
          title: this.emp.title,
          paragraph: this.emp.paragraph,
        });




        this.compDetailsModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    }
  }
}




editComprehensionDetails(index: number) {
  this.compDetailsModal?.show();
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








        this.compDetailsModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    });
  }
}


// processParagraph(): string {
//   let processedParagraph = this.emp.paragraph;


//   // Apply both bold and underline with a specific color to each keyword
//   this.emp.keywords.forEach(keyword => {
//     const regex = new RegExp(keyword, 'gi');
//     processedParagraph = processedParagraph.replace(regex, match => `<strong style="color: #71198F;">${match}</strong>`);
//   });


//   return processedParagraph;
// }
processParagraph(): string {
  let processedParagraph = this.emp.paragraph;


 
  this.emp.keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    processedParagraph = processedParagraph.replace(regex, match => `<strong><font color= #71198F  size="3"> <u>${match} </u> </font> </strong>`);
  });
 
  

  return processedParagraph;
}
// processParagraph(): string {
//   let processedParagraph = this.emp.paragraph;

//   this.emp.keywords.forEach(keyword => {
//     const regex = new RegExp(keyword, 'gi');
//     processedParagraph = processedParagraph.replace(regex, match => `<strong><font style="color: #71198F; border-bottom: 1px solid; font-size: 3px;">${match}</font></strong>`);
//   });

//   return processedParagraph;
// }


filterTable(keywords: string[]) {
  // Filter the vocabularyData based on keywords
  this.filteredData = this.vocabularyData.filter((item) =>
    keywords.some((keyword) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}


showDetails(emp: any) {
  this.selectedEmp = emp;
  // Update filteredData based on the selectedEmp keywords
  this.filterTable(emp.keywords);
}
 
}
























