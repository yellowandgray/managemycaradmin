import { Component, ViewChild } from '@angular/core';
import { Garages, Priceinfo } from '../api/garageobj';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Question } from '../../gramar/api/comprehensionobj';
@Component({
  selector: 'app-garages',
  templateUrl: './garages.component.html',
  styleUrls: ['./garages.component.scss']
})
export class GaragesComponent {

  breadCrumbItems!: Array<{}>;
 
  garages: Garages[] = [];
  MessageFormData: FormGroup;
  emp: Garages = new Garages();
  deleteId:string='';


 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  dataSubscription: Subscription | null = null;
 
  selectedImage: any = null;
  loading: boolean = true;


  selectedStandard: string = '';


  Garagest: Observable<any[]> = new Observable<any[]>();


  selectedSection: string = '';
  searchTerm: string = '';

  studentNames: string[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedStudentIndex: number | null = null;
  uploading: boolean = false;
  // private readonly fileName = 'student_bulk_data_template.xlsx';



  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;






 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
   
    this.MessageFormData = new FormGroup({  
      'about': new FormControl('', Validators.required),  
      'address': new FormControl('', Validators.required),      
      'geolocation': new FormControl('', Validators.required),      
      'name': new FormControl('', Validators.required),    
      'openinghrs': new FormControl('', Validators.required),    
      'otherservices': new FormControl('', Validators.required),      
      'postcode': new FormControl('', Validators.required),
        
      // 'active': new FormControl(''),
    });    
       
    if (this.emp != null) {




      this.MessageFormData.patchValue({      
        about: this.emp.about,
        address: this.emp.address,
        geolocation: this.emp.geolocation,
        name: this.emp.name,
        openinghrs:  this.emp.openinghrs,  
        otherservices:  this.emp.otherservices,  
        postcode:  this.emp.postcode,  
      
 
      });
      // this.key = this.data.data.key;
      this.emp.about= this.emp.about;
      this.emp.address= this.emp.address;  
      this.emp.geolocation= this.emp.geolocation;  
      this.emp.name= this.emp.name;
      this.emp.openinghrs= this.emp.openinghrs;  
      this.emp.otherservices= this.emp.otherservices;  
      this.emp.postcode= this.emp.postcode;
     
    }
  
    
  }


  ngOnInit() {

    this.loading= true;
   
    this.dataSubscription = this.apiService.getGaragesData().subscribe(
      (actions) => {
        this.garages = actions.map((action) => action.payload.doc.data() as Garages);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
       
      }
    );


  }




  navigateToDetails(name: string) {
 
    this.router.navigate(['/studentdetails', name]);
  }
 
 
  showImagePreview(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
    this.showModals1?.show(); // Show the modal
  }
 
 
 
 
 
  deletpop(id:string){
    this.deleteModal?.show()
     this.deleteId=id;




  }

  addPrice(id:string){
    this.addCourse?.show();
    this.Garagest=this.apiService.getPriceInfo(id);
  }




  delet(id: string){
  this.apiService.deleteGaragestData(id)
   this.deleteModal?.hide()
  }


  Priceinfosave(){
    this.addCourse?.hide()
}
  
  add(){
    this.MessageFormData;
    this.deleteRecordModal?.show()
    this.emp = new Garages();
 
  }
 
  addQuestion() {
    const newQuestion: Priceinfo = {
      no: this.emp.priceinfo.length + 1,
      amount: '',
      desc: '',
      include: '',
      servicename: '',
     
    };
 
    this.emp.priceinfo.push(newQuestion);
  }

  save() {
console.log("student data",this.emp);
this.apiService.createGaragesData(this.emp);
this.deleteRecordModal?.hide()

  }

  editStudent(index: number) {
 

  this.emp = { ...this.garages[index] };

   
    this.MessageFormData.patchValue({
      about: this.emp.about,
      address: this.emp.address,
      geolocation: this.emp.geolocation,
      name: this.emp.name,
      openinghrs:  this.emp.openinghrs,  
      otherservices:  this.emp.otherservices,  
      postcode:  this.emp.postcode,  
    
    });
    this.showModals?.show();
 
   
  }
  update(id: string)
  {
  console.log(id)
     this.apiService.updateGaragesData(id.toString(), this.emp);
     this.emp = new Garages();
     this.showModals?.hide();
     
   
  }




// breadCrumbItems!: Array<{}>;
// comprehensions: Comprehension[] = [];
// filteredItems: Comprehension[] = [];

// addlists1: Comprehension[] = [];
// image_path: string = '';
// selectedImage: any = null;
// imgSrc: string='';
// emp: Comprehension = new Comprehension();
// GrammarId:string='XOO5IdohbzztfCg4GU6y';
// form: FormGroup | undefined;

// MessageFormData: FormGroup;
// questions: Question[] = [];
// // MessageFormData: FormGroup;
// assignForm: FormGroup;
// selectedStandards: string[] = [];
// selectedItemId: string ='';
// standardsList: string[] = ['UKG','LKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
// allPossibleStandards: string[] = [];
// fetchedStandards: string[] = [];

// assignid: string ='';
// fetchedStandards1: string[] = [];

// showAllItems: boolean = true;

// empKeywords: string[] = [];
// selectedEmp: any;




// selectedOption: string = '';
// searchTerm: string = '';
// dataSubscription: Subscription | null = null;
// school_id: string = 'stZWDh06GmAGgnoqctcE';
// kgSheetId = '3u90Jik86R10JulNCU3K';
// SchoolId:string='stZWDh06GmAGgnoqctcE';
// ScoreId:string='4UwpeVOx1X4YofEWx3jq';
// deleteId:string='';




// itemDetails: any[] = [];
// itemDetailsNew: any[] = [];
// selectedIds: string[] = [];
// selectedKeyWords: Set<string> = new Set<string>();
// selectedKeywords1: string[] = [];



// currListID:string='';
// selectedPreviewImage: string | null = null;




// @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
// @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
// @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
// @ViewChild('keywordModal', { static: false }) keywordModal?: ModalDirective;
// // @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
// @ViewChild('deleteRecordModal2') deleteRecordModal2: any;
// @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
// @ViewChild('compDetailsModal', { static: false }) compDetailsModal?: ModalDirective;








// constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private formBuilder: FormBuilder,private fb: FormBuilder) {
// //  this.MessageFormData = new FormGroup({  
// //   'no': new FormControl('', Validators.required),  
// //   'title': new FormControl('', Validators.required),      
// //   'paragraph': new FormControl('', Validators.required),
// //   'questions': new FormControl([])
// //   });
// this.MessageFormData = this.formBuilder.group({
//   'no': ['', Validators.required],
//   'title': ['', Validators.required],
//   'paragraph': ['', Validators.required],
//   'questions': this.formBuilder.array([]) // FormArray for questions
// });this.assignForm = new FormGroup({
//   'standard': new FormControl([]),
// });












// if (this.emp != null) {
//   this.MessageFormData.patchValue({  
//     id:this.emp.id,    
//     no: this.emp.no,
//     title: this.emp.title,
//     paragraph: this.emp.paragraph,
//    questions:this.emp.questions








//   });
//   this.emp.no= this.emp.no;  
//   this.emp.title= this.emp.title;
//   this.emp.id= this.emp.id;
//   this.emp. paragraph =this.emp.paragraph;
//   this.emp. questions =this.emp.questions;

// } }



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
       
       
//       })
     
//     },);








// }




// addQuestion() {
//   const newQuestion: Question = {
//     qno: this.emp.questions.length + 1,
//     qstn: '',
//     qtype: 'MCQA',
//     a: '',
//     b: '',
//     c: '',
//     d: '',
//     answer: ''
//   };

//   this.emp.questions.push(newQuestion);
// }

// get questionsForm() {
//   return this.MessageFormData.get('questions') as FormArray;
// }


// get questionsFormArray() {
//   return this.MessageFormData.get('questions') as FormArray;
// }




// save(id:string){
// this.apiService.createComprehensionQuestions(this.emp,this.GrammarId);
// this.addCourse?.hide();
// this.emp = new Comprehension();

// }




// editComprehension(index: number) {
// this.deleteRecordModal?.show();
// const selectedComprehension = this.comprehensions[index];
// if (selectedComprehension) {
//   this.emp = { ...selectedComprehension };
//   this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {
//     this.emp.questions = actions.map(action => action.payload.doc.data() as any);
//     if (this.emp.questions) {
//       const questionFormArray = this.emp.questions.map((question: any) => {
//         return this.fb.group({
//           id: [question.id],
//           qno: [question.qno],
//           qstn: [question.qstn],
//           qtype: [question.qtype],
//           a: [question.a],
//           b: [question.b],
//           c: [question.c],
//           d: [question.d],
//           answer: [question.answer]
//         });
//       });
//       this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
//       this.MessageFormData.patchValue({
//         id: this.emp.id,
//         no: this.emp.no,
//         title: this.emp.title,
//         paragraph: this.emp.paragraph,
//       });
//       this.deleteRecordModal?.onHidden.subscribe(() => {
//         this.MessageFormData.reset();
//       });
//     }
//   });
// }
// }




// editComprehension1(index: number) {
// this.keywordModal?.show();
// const selectedComprehension = this.comprehensions[index];



// if (selectedComprehension) {
//   this.emp = { ...selectedComprehension };
//   this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {


//     this.emp.questions = actions.map(action => action.payload.doc.data() as any);


//     if (this.emp.questions) {
//       const questionFormArray = this.emp.questions.map((question: any) => {
//         return this.fb.group({
//           id: [question.id],
//           qno: [question.qno],
//           qstn: [question.qstn],
//           qtype: [question.qtype],
//           a: [question.a],
//           b: [question.b],
//           c: [question.c],
//           d: [question.d],
//           answer: [question.answer]
//         });
//       });

//       this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
//       this.MessageFormData.patchValue({
//         id: this.emp.id,
//         no: this.emp.no,
//         title: this.emp.title,
//         paragraph: this.emp.paragraph,
//       });


//       this.keywordModal?.onHidden.subscribe(() => {
//         this.MessageFormData.reset();
//       });
//     }
//   });
// }
// }






// updateQuestions() {
// const questionFormArray = this.emp.questions.map((question: any) => {
//   return this.fb.group({
//     id: [question.id],
//     qno: [question.qno],
//     qstn: [question.qstn],
//     qtype: [question.qtype],
//     a: [question.a],
//     b: [question.b],
//     c: [question.c],
//     d: [question.d],
//     answer: [question.answer],
//   });
// });




// this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));

// }


// update(id: string) {


// this.updateQuestions();
// const updatedQuestions = this.MessageFormData.value.questions.map((question: any) => {
//   return {
//     id: question.id,
//     qno: question.qno,
//     qstn: question.qstn,
//     qtype: question.qtype,
//     a: question.a,
//     b: question.b,
//     c: question.c,
//     d: question.d,
//     answer: question.answer,
//   };
// });




// this.emp.questions = updatedQuestions;




// this.apiService.updateComprehensionData(id.toString(), this.emp, this.GrammarId);




// this.emp = new Comprehension();
// this.deleteRecordModal?.hide();
// }




// showPreview(event: any) {
// if (event.target.files && event.target.files[0]) {
//   const reader = new FileReader();
//   reader.onload = (e: any) => this.imgSrc = e.target.result;
//   reader.readAsDataURL(event.target.files[0]);
//   this.selectedImage = event.target.files[0];
//   this.image_path='';
//   if (this.selectedImage != null) {
//     var category = 'images';
//     var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
//     const fileRef = this.storage.ref(filePath);




//     this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
//       finalize(() => {
//         fileRef.getDownloadURL().subscribe((url) => {
//           this.emp.pic = url;
//           console.log('imagePathsdb:', this.emp.pic ); // Check if it's populated here
//         });
//       })
//     ).subscribe(
//       () => {
//         console.log('Upload completed successfully');
//       },
//       (error) => {
//         console.error('Upload error:', error);
//       }
//     );
//   }




// }
// else {
//   this.imgSrc = '/assets/images/image_placeholder.jpg';
//   this.selectedImage = null;
// }
// }




// showPreview1(event: any, index: number) {
// console.log("step 0");




// if (event.target.files && event.target.files[0]) {
//   console.log("Step 1");
//   const reader = new FileReader();
 
//   reader.onload = (e: any) => {
//     this.imgSrc = e.target.result;
//     console.log("Step 2");
//   };




//   reader.readAsDataURL(event.target.files[0]);
//   this.selectedImage = event.target.files[0];
//   this.image_path = '';




//   if (this.selectedImage != null) {
//     console.log("Step 3");
//     var category = 'images';
//     var filePath = `${category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
//     const fileRef = this.storage.ref(filePath);




//     this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
//       finalize(() => {
//         fileRef.getDownloadURL().toPromise().then((url) => {
//           // Update the itemDetails array with the new image URL
//           this.itemDetails[index].pic = url;
//           this.itemDetailsNew[index].pic = url;
//           console.log("Step 4");
//           console.log('imagePathsdb1:', this.itemDetails[index].pic);
//           console.log("All Item Details after image upload", this.itemDetails);
//           // Check if it's populated here
//         }).catch(error => {
//           console.log("Step 6");
//           console.error('Download URL error:', error);
//         });
//       })
//     ).subscribe(
//       () => {
//         console.log("Step 5");
//         console.log('Upload completed successfully');
//         console.log("All Item Details after image upload", this.itemDetails);
//       },
//       (error) => {
//         console.log("Step 6");
//         console.error('Upload error:', error);
//       }
//     );
//   }
// } else {
//   console.log("Step 7");
//   this.imgSrc = '/assets/images/image_placeholder.jpg';
//   this.selectedImage = null;
// }
// }


// delet(id: string){
// this.apiService.quarydeleteComprehensionData(this.GrammarId,id)
// this.deleteModal?.hide()




// }


 
//  add(){
//   this.MessageFormData;
//   this.addCourse?.show()
//   this.emp = new Comprehension();
 
// }
// showImagePreview(imageUrl: string) {
//   this.selectedPreviewImage = imageUrl;
//   this.showModals1?.show(); // Show the modal
// }


// filterItems(index: number, event: any): void {
// console.log("step 4");









// console.log("event value",this.itemDetails[index].name);




// // Find the corresponding item in vocabularyData based on the selected name
// const selectedItem = this.vocabularyData.find(item => item.name === event.target.value);




// if (selectedItem) {
//   // If found, update the id and name in the itemDetails array
//   this.itemDetails[index].id = selectedItem.id;
//   this.itemDetails[index].name = selectedItem.name;
//   this.itemDetails[index].pic = selectedItem.pic;
//   this.itemDetails[index].desc = selectedItem.desc;
//   console.log("item id", this.itemDetails[index].id);
//   console.log("item name", this.itemDetails[index].name);
//   console.log("item picture", this.itemDetails[index].pic);
 
//   if (selectedItem.id) {
//     this.selectedIds.push(selectedItem.name);
//     this.selectedKeyWords.add(event.target.value);
//     console.log("Selected Keywords Name", this.selectedIds);
//   }
// } else {
//   // If not found, reset the id, name, pic, and desc to empty values
 
//   this.itemDetails[index].id = '';
//   this.itemDetails[index].name = event.target.value;
//   this.itemDetailsNew[index].name = event.target.value;
//   this.itemDetails[index].pic = '';
//   this.itemDetails[index].desc = '';
//   console.error('Item not found for name:', event.target.value);
//   console.log("new vocabulary data ", this.itemDetails[index].name)
// }
// this.selectedItems = this.filteredAdditems;
// }








// onDropdownChange(index: number, selectedItemId: string): void {
// // Find the selected item by ID

// const selectedItem = this.vocabularyData.find(item => item.name === selectedItemId);
// // console.log(selectedItem);
// // Update the selected item for the specific dropdown
// if (selectedItem !== undefined) {
//   //this.items[index] = selectedItem;
// } else {
 
//   // Handle the case where the item is not found (optional)
//   console.error(`Item with ID ${selectedItemId} not found.`);
//   // You can choose to set a default or handle this case according to your application's logic.
// }
// }




// filterItems1(index: number, event: any): void {

// this.itemDetails[index].desc = event.target.value;
// console.error('item desc',this.itemDetails[index].desc);
// }








// addRow(): void {
// // this.items.push({ id: '', name: '', picture: '', punctuation: '' });
//  this.itemDetails.push({ id: '', name: '', pic: '', desc: '' });
// }






// applyNameFilter() {
// // Apply name filtering
// this.filteredItems = this.comprehensions.filter(List => {
//   const nameMatch = !this.searchTerm || List.title.toLowerCase().includes(this.searchTerm.toLowerCase());
//   return nameMatch;
// });




// if (!this.filteredItems.length) {
// }
// }
// filteredItemsName(event: any): void {
// const value = event.target.value;
// this.searchTerm = value;
// this.filterItemsByOption(); // Call the combined function
// }




// deletpop(id:string){
// this.deleteModal?.show()
//  this.deleteId=id;


// }


// isItemInVocabulary(itemName: string): boolean {
// return this.vocabularyData.some(item => item.name === itemName);
// }




// showUploaderForItem(item: any): boolean {
// return item.name !== '' && !this.isItemInVocabulary(item.name);
// }




// // Your component code...


// editComprehensionDetails1(compId: string, index: number) {








// this.compDetailsModal?.show();




// const selectedComprehension = this.comprehensions.find((d) => d.id === compId);
// this.apiService.getScoreData(this.SchoolId, this.ScoreId).subscribe(actions => {
//   this.score = actions.map(action => action.payload.doc.data() as Score);

// });




// if (selectedComprehension) {
//   this.emp = { ...selectedComprehension };




//   if (this.emp.questions) {








//     const question = this.emp.questions[index];
//     const isQuestionAlreadyAdded = this.MessageFormData.value.questions.some(
//       (q: any) => q.id === question.id
//     );




//     if (!isQuestionAlreadyAdded) {
//       const questionFormArray = this.fb.group({
//         id: [question.id],
//         qno: [question.qno],
//         qstn: [question.qstn],
//         qtype: [question.qtype],
//         a: [question.a],
//         b: [question.b],
//         c: [question.c],
//         d: [question.d],
//         answer: [question.answer],
//       });




//       this.MessageFormData.setControl(
//         'questions',
//         this.fb.array([...this.MessageFormData.value.questions, questionFormArray])
//       );




//       this.MessageFormData.patchValue({
//         id: this.emp.id,
//         no: this.emp.no,
//         title: this.emp.title,
//         paragraph: this.emp.paragraph,
//       });




//       this.compDetailsModal?.onHidden.subscribe(() => {
//         this.MessageFormData.reset();
//       });
//     }
//   }
// }
// }




// editComprehensionDetails(index: number) {
// this.compDetailsModal?.show();
// const selectedComprehension = this.comprehensions[index];








// if (selectedComprehension) {
//   this.emp = { ...selectedComprehension };
//   this.apiService.getComprehensionQuestionsData(this.GrammarId, this.emp.id).subscribe(actions => {
//     this.emp.questions = actions.map(action => action.payload.doc.data() as any);
//     if (this.emp.questions) {
//       const questionFormArray = this.emp.questions.map((question: any) => {
//         return this.fb.group({
//           id: [question.id],
//           qno: [question.qno],
//           qstn: [question.qstn],
//           qtype: [question.qtype],
//           a: [question.a],
//           b: [question.b],
//           c: [question.c],
//           d: [question.d],
//           answer: [question.answer]
//         });
//       });

//       this.MessageFormData.setControl('questions', this.fb.array(questionFormArray));
//       this.MessageFormData.patchValue({
//         id: this.emp.id,
//         no: this.emp.no,
//         title: this.emp.title,
//         paragraph: this.emp.paragraph,
//       });








//      // Move the show() call here








//       this.compDetailsModal?.onHidden.subscribe(() => {
//         this.MessageFormData.reset();
//       });
//     }
//   });
// }
// }

}
