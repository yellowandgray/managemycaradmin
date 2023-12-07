import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Comprehension, Question } from '../api/comprehensionobj';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { array } from '@amcharts/amcharts5';
import { Assign } from '../api/assignobj ';
import { Subscription } from 'rxjs';




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
  
  emp: Comprehension = new Comprehension();
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  form: FormGroup | undefined;
 
  MessageFormData: FormGroup;
  questions: Question[] = [];
 // MessageFormData: FormGroup;
 assignForm: FormGroup;
 selectedStandards: string[] = [];
 selectedItemId: string ='';
 standardsList: string[] = ['V','VI','VII','VIII','IX','X','XI','XII'];
 allPossibleStandards: string[] = [];
 fetchedStandards: string[] = [];
 assign: Assign =new Assign();
 assignid: string ='';
 fetchedStandards1: string[] = [];

 selectedOption: string = '';
 searchTerm: string = '';
 dataSubscription: Subscription | null = null;
 school_id: string = 'stZWDh06GmAGgnoqctcE';
 kgSheetId = '3u90Jik86R10JulNCU3K';
@ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
// @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
@ViewChild('deleteRecordModal2') deleteRecordModal2: any;



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
    this.allPossibleStandards = ['V','VI','VII','VIII','IX','X','XI','XII'];
  } }
 
 
  // ngOnInit() {
  //   // Create an array to store the standards
  //   const allStandards: any[] = [];
  
  //   this.comprehensions.forEach(item => {
  //     const listId = item?.id;
  
  //     this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
  //       // Map actions to Comprehension objects and assign to this.comprehensions
  //       this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
        
  //       // Log the mapped array
  //       console.log(this.comprehensions);
  //     });
  
  //     // Using optional chaining to avoid errors if 'id' is undefined
  //     if (listId) {
  //       this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
  //         standards => {
  //           // Get the first element of the standards array or an empty array if it's undefined
  //           const currentStandards = standards[0]?.standard || [];
            
  //           // Update item.standard with the fetched standards and the current date
  //           item.standard = [...currentStandards, new Date().toISOString()];
            
  //           // Log the updated item
  //           console.log("Updated item with standards and date", item);
            
  //           // Push the standards to the allStandards array
  //           allStandards.push(item.standard);
  //         },
  //         error => {
  //           console.error('Error fetching standards:', error);
  //         }
  //       );
  //     }
  //   });
  
  //   // Log the final array of all standards after the loop completes
  //   console.log("All Standards:", allStandards);
  // }
  // ngOnInit() {
  //   this.school_id = localStorage.getItem('school_id') ?? '';
  //   if (this.school_id !== '') {
  //     this.apiService.getComprehensionData(this.kgSheetId).subscribe(actions => {
  //       this.comprehensions = actions.map(action => {
  //         const data = action.payload.doc.data() as Comprehension;
  //         return {
  //           id: data.id,
  //           title: data.title,
  //           no: data.no,
  //           paragraph: data.paragraph,
  //           questions: data.questions,
  //           standard: data.standard  
  //         } as Comprehension;
  //       });
  
    //       this.comprehensions.forEach(item => {
    //         const listId = item?.id; // Using optional chaining to avoid errors if 'id' is undefined
    //         if (listId) {
    //           this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
    //             standards => {
    //               item.standard = standards[0]?.standard || [];
    //               console.log('Fetched standards:', item.standard);
    //             },
    //             error => {
    //               console.error('Error fetching standards:', error);
    //             }
    //           );
    //         }
    //       });
    
    //       console.log("Step 1", this.comprehensions);
    //     });
    //   }
  // }
  



  
  // ngOnInit() {
  //   this.apiService.getComprehensionData(this.GrammarId).subscribe(actions => {
  //     this.comprehensions = actions.map(action => action.payload.doc.data() as Comprehension);
  //     console.log(this.comprehensions[0].standard,"check")
  //   });
  // }
  ngOnInit() {
    // this.loading= true;
    this.dataSubscription = this.apiService.getComprehensionData(this.GrammarId).subscribe(
      (actions) => {
        this.comprehensions = actions.map((action) => action.payload.doc.data() as Comprehension);
        // this.comprehensions.sort((a, b) => a.title.localeCompare(b.title));
        this.filteredItems = [...this.comprehensions];
        this.allItems=  this.comprehensions;
        console.log('sdsdsd' , this.comprehensions)
        console.log('sdsdsd' , this.comprehensions)
        this.comprehensions.forEach(item => {
          console.log("Step 0: Checking item", item);
          const listId = item?.id; // Using optional chaining to avoid errors if 'id' is undefined
          console.log("Step 1.0", listId);
         
          if (listId) {
            console.log("Step 1.1: Entering loop for item with id", listId);
            this.apiService.getStandardsForList(this.school_id, this.kgSheetId, listId).subscribe(
              standards => {
                this.selectedStandards = standards[0]?.standard || [];
                console.log('Fetched a standards:', this.selectedStandards);
                item.standard =this.selectedStandards;
                console.log("Step 1.2: Updated item with standards", item);
                
              },
              error => {
                console.error('Error fetching standards:', error);
               
              }
            );
          }
        })
        
      },);

  }

  // addQuestion() {
  //   this.emp.questions.push({ qstn: '', qtype: 'MCQA', a: '', b: '', c: '', d: '',qno: this.emp.questions.length + 1, answer: '' });
  //   console.log(this.emp.questions)
  // }
  // addQuestion() {
  //   const questionGroup = this.fb.group({
  //     qstn: ['', Validators.required],
  //     qtype: ['MCQA', Validators.required],
  //     a: ['', Validators.required],
  //     b: ['', Validators.required],
  //     c: ['', Validators.required],
  //     d: ['', Validators.required],
  //     answer: ['', Validators.required],
  //     qno: this.emp.questions.length + 1,
     
  //   });


  //   (this.MessageFormData.get('questions') as FormArray).push(questionGroup);
  // }

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
    console.log(this.emp.questions);
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




printFormData() {
  console.log('Printed Form Data:', this.MessageFormData.value);


}




// editComprehension(index: number) {
//   const selectedStudent = this.comprehensions [index];
 
 
//   this.emp = { ...selectedStudent };
 
//   this.MessageFormData.patchValue({
//     id:this.emp.id,    
//     no: this.emp.no,
//     title: this.emp.title,
//     paragraph: this.emp.paragraph,
 
//   });
 
//   this.deleteRecordModal?.show();


//   this.deleteRecordModal?.onHidden.subscribe(() => {
//     this.MessageFormData.reset();
 
//   });
// }




// editComprehension(index: number) {
//   const selectedComprehension = this.comprehensions[index];


//   this.emp = { ...selectedComprehension };


//   this.MessageFormData.patchValue({
//     id: this.emp.id,
//     no: this.emp.no,
//     title: this.emp.title,
//     paragraph: this.emp.paragraph,
//     questions:this.emp.questions
//   });


 
//   this.deleteRecordModal?.show();


//   // Subscribe to modal hidden event to reset the form
//   this.deleteRecordModal?.onHidden.subscribe(() => {
//     this.MessageFormData.reset();
//   });
// }






// editComprehension(index: number) {
//   console.log("Step 1");
//   const selectedComprehension = this.comprehensions[index];


//   if (selectedComprehension) {
//     this.emp = { ...selectedComprehension };
//     console.log("Step 2");
//     console.log("comprehension id ", this.emp.id);
//     this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {
    
//        this.emp.questions = actions.map(action => action.payload.doc.data() as any);

//       if (this.emp.questions) {
//         console.log("Questions", this.emp.questions);
//         const questionFormArray = this.emp.questions.map((question: any) => {
//           return this.fb.group({
//             id: [question.id],
//             qno: [question.qno],
//             qstn: [question.qstn],
//             qtype: [question.qtype],
//             a: [question.a],
//             b: [question.b],
//             c: [question.c],
//             d: [question.d],
//             answer: [question.answer]
//           });
//         });

//         console.log("Step 3");
//         console.log("Questions array", questionFormArray);
//         this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
     
//       }
// console.log("messsage form data", this.MessageFormData);
//       this.MessageFormData.patchValue({
//         id: this.emp.id,
//         no: this.emp.no,
//         title: this.emp.title,
//         paragraph: this.emp.paragraph,
//       });
//       console.log("messsage form data", this.MessageFormData.value);
//       this.deleteRecordModal?.show();


//       this.deleteRecordModal?.onHidden.subscribe(() => {
//         this.MessageFormData.reset();
//       });
//     });
//   }
// }
editComprehension(index: number) {
  this.deleteRecordModal?.show(); 
  console.log("Step 1");
  const selectedComprehension = this.comprehensions[index];

  if (selectedComprehension) {
    this.emp = { ...selectedComprehension };
    console.log("Step 2");
    console.log("comprehension id ", this.emp.id);
    this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {

      this.emp.questions = actions.map(action => action.payload.doc.data() as any);

      if (this.emp.questions) {
        console.log("Questions", this.emp.questions);
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

        console.log("Step 3");
        console.log("Questions array", questionFormArray);
        this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));

        console.log("messsage form data", this.MessageFormData);
        this.MessageFormData.patchValue({
          id: this.emp.id,
          no: this.emp.no,
          title: this.emp.title,
          paragraph: this.emp.paragraph,
        });

        console.log("messsage form data", this.MessageFormData.value);
       // Move the show() call here

        this.deleteRecordModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    });
  }
}


// trackByQuestion(index: number, item: AbstractControl): any {
//   return index;
// }






// updateQuestions() {
//   const questionFormArray = this.emp.questions.map((question: any) => {
//     return this.fb.group({
//       id: [question.id],
//       qno: [question.qno],
//       qstn: [question.qstn],
//       qtype: [question.qtype],
//       a: [question.a],
//       b: [question.b],
//       c: [question.c],
//       d: [question.d],
//       answer: [question.answer],
//     });
//   });


//   this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));


//   const updatedQuestions = this.emp.questions.map((question, index) => {
//     const questionFormGroup = questionFormArray.at(index) as FormGroup;
//     return {
      
//       id: questionFormGroup.get('id')?.value,
//       qno: questionFormGroup.get('qno')?.value,
//       qstn: questionFormGroup.get('qstn')?.value,
//       qtype: questionFormGroup.get('qtype')?.value,
//       a: questionFormGroup.get('a')?.value,
//       b: questionFormGroup.get('b')?.value,
//       c: questionFormGroup.get('c')?.value,
//       d: questionFormGroup.get('d')?.value,
//       answer: questionFormGroup.get('answer')?.value,
//     };
//   });


//   this.emp.questions = updatedQuestions;
// }

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



// Assuming 'this.emp.questions' is an array of type 'Question'
// Assuming 'this.emp.questions' is an array of type 'Question'








// update(id: string) {
//   this.updateQuestions();
//   this.apiService.updateComprehensionData(id.toString(), this.emp, this.GrammarId);
//   this.emp = new Comprehension();
//   this.deleteRecordModal?.hide();
// }

// update(id: string) {
//   this.updateQuestions();
//   this.apiService.updateComprehensionData(id.toString(), this.emp, this.GrammarId);
//   this.emp = new Comprehension();
//   this.deleteRecordModal?.hide();
// }

// update(id: string) {
//   this.updateQuestions();
//   const updatedQuestions = this.MessageFormData.value.questions.map((question: any) => {
//     return {
//       // id: question.id,
//       qno: question.qno,
//       qstn: question.qstn,
//       qtype: question.qtype,
//       a: question.a,
//       b: question.b,
//       c: question.c,
//       d: question.d,
//       answer: question.answer,
//     };
//   });

//   this.emp.questions = updatedQuestions;

//   this.apiService.updateComprehensionData(id.toString(), this.emp, this.GrammarId);

 
//   this.emp = new Comprehension();
//   this.deleteRecordModal?.hide();
// }

update(id: string) {

  this.updateQuestions();
console.log( this.updateQuestions())
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



delet(id: string){
  console.log(id,'check')
  this.apiService.quarydeleteComprehensionData(this.GrammarId,id)
  console.log(this.apiService.quarydeleteComprehensionData(id,this.GrammarId),'check')

}




  // update(id: string)
  //  {
  //    this.apiService.updateComprehensionData(id.toString(),this.emp,this.GrammarId);
  //    this.emp = new Comprehension();
  //    this.deleteRecordModal?.hide();
  //     // this.resetForm;


  //  }
   
   add(){
    this.MessageFormData;
    this.addCourse?.show()
    this.emp = new Comprehension();
   
  }

//assign



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
  console.log('Selected Standards:', this.selectedStandards);
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
signSelectedStandards(): void {
  console.log("Step 0");
  this.selectedStandards.forEach(standard => {
    this.assignstd1(standard);
  });
}

 
// filteredTeacher(event: any): void {
//   const value = event.target.value;
//   console.log('Filtering by name...', value);
//   this.searchTerm = value;
//   this.filterTeacher();
// }


// filterTeacher() {
//   console.log('Filtering...', this.searchTerm);


//   this.filteredItems = this.comprehensions.filter(teacher => {
   
//     const nameMatch = !this.searchTerm || teacher.title.toLowerCase().includes(this.searchTerm.toLowerCase());


//     return nameMatch;
//   });


//   if (!this.filteredItems.length) {
//     console.log('Nooo Students...');
//     this.filteredItems = [];
//     console.log(this.filteredItems);
//   }
// }

filterItemsByOption() {
  if (this.selectedOption === 'ALL' || this.selectedOption === '') {
    console.log(this.comprehensions = [...this.allItems])
    this.comprehensions = [...this.allItems];
    this.applyNameFilter(); // Apply name filtering
  } else {
    console.log("selected option",this.selectedOption)
    this.apiService.getListID(this.school_id, this.kgSheetId, this.selectedOption).subscribe(listIds => {
      this.comprehensions = this.allItems.filter(item => listIds.includes(item.id));
      console.log("filtered comp",this.comprehensions)
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
    console.log('No Students...');
  }
}
filteredItemsName(event: any): void {
  const value = event.target.value;
  console.log('Filtering by name...', value);
  this.searchTerm = value;
  this.filterItemsByOption(); // Call the combined function
}

 
}



