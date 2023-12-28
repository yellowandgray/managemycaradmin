import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Score } from '../api/scoreobj';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comprehension, Question } from '../api/compstudentobj';
import { Index } from 'firebase/firestore';
import { KgSheet } from '../api/kgsheetobj';
import { Addlist } from '../api/addlistobj';
import { CreateMarks } from '../../test-exam/api/studentmarkobj';
import { Student } from '../api/addressobj';
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent {
  breadCrumbItems!: Array<{}>;
  currentTab:any = "Behaviour"
  score:Score[]=[];
  scoreform:Score[]=[];
  kgsheet:KgSheet[]=[];

  // filteredmarks: { student: Student; marks: CreateMarks }[] = [];
  filterstudent: Student[] = [];
  students: Student[] = [];
  emp: Comprehension = new Comprehension(); 
  MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  ScoreId:string='4UwpeVOx1X4YofEWx3jq';
  GrammarId:string='XOO5IdohbzztfCg4GU6y';
  kgSheetId = '3u90Jik86R10JulNCU3K';
  
  dataSubscription: Subscription | null = null;
  comprehensions: Comprehension[] = [];
  addlists: Addlist[] = [];
  rec_no: string | null;
  name: string | null;
  standard: string | null;
  section: string | null;
  Dob: Date | null;
  parentname: string | null;
  address: string | null;
  mobile: string | null;
  image: string | null;
  studentid: string | null;
  selectedTab: number | null = null;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
 
  constructor(private route: ActivatedRoute,private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private formBuilder: FormBuilder,private fb: FormBuilder) { 
 
  this.studentid= '';
  this.rec_no = '';
  this.name = '';
  this.standard = '';
  this.section = '';
  this.Dob = null;
  this.parentname = '';
  this.address = '';
  this.image = '';
  this.mobile = '';

  this.MessageFormData = this.formBuilder.group({
    'no': ['', Validators.required],
    'title': ['', Validators.required],
    'paragraph': ['', Validators.required],
    'questions': this.formBuilder.array([]) 
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

  } }



  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.studentid = params.get('studentid');
      this.rec_no = params.get('rec_no');
      this.name = params.get('name');
      this.standard = params.get('standard');
      this.section = params.get('section');
      this.Dob = params.get('Dob') ? new Date(params.get('Dob')!) : null;
      this.parentname = params.get('parentname');
      this.address = params.get('address');
      this.mobile = params.get('mobile');
      this.image = params.get('image');
      this.selectedTab = params.get('select') ? +params.get('select')! : null;
    });
   
   
    this.route.paramMap.subscribe((params) => {
      this.studentid = params.get('studentid');
     
      this.apiService.getScoreData(this.SchoolId, this.ScoreId).subscribe(actions => {
        this.score = actions.map(action => action.payload.doc.data() as Score);
  
        this.score = this.score.filter(score => score.stuid === this.studentid);
      });

      this.apiService.getKgsheetQuestionsData(this.SchoolId, this.ScoreId).subscribe(actions => {
        this.kgsheet = actions.map(action => action.payload.doc.data() as KgSheet);
  console.log(   this.kgsheet = actions.map(action => action.payload.doc.data() as KgSheet),'check')
        this.kgsheet = this.kgsheet.filter(kgsheet => kgsheet.stuid === this.studentid);
        console.log(this.kgsheet,'check')
      });

      
    });


    
    this.apiService.getListData(this.kgSheetId).subscribe(actions => {
      this.addlists = actions.map(action => action.payload.doc.data() as Addlist);
  
    });

    this.dataSubscription = this.apiService.getComprehensionData(this.GrammarId).subscribe(comprehensions => {
      comprehensions.forEach(comprehension => {
        const comprehensionData = comprehension.payload.doc.data() as Comprehension;
        const comprehensionId = comprehension.payload.doc.id;
    
        this.apiService.getComprehensionQuestionsData(this.GrammarId, comprehensionId).subscribe(questions => {
          const questionsData = questions.map(question => question.payload.doc.data() as Question);
          
          comprehensionData.questions = questionsData;
          this.comprehensions.push(comprehensionData);
        });
      });
    });
  

//     this.dataSubscription = this.apiService.getAddressBookData().subscribe(
//       (actions) => {
//         this.students = actions.map((action) => action.payload.doc.data() as Student);
//         this.students.sort((a, b) => a.name.localeCompare(b.name));
     
//         this.filterstudent = this.students.filter((student) => this.standards.includes(student.standard));
//         this.marksList = this.filterstudent.map((student) => ({
//           student,
//           marks: new CreateMarks(),
//         }));
//      this.filteredmark= this.filterstudent.map((student) => ({
//       student,
//       marks: new CreateMarks(),

//     }));

//     this.apiService.getMarkData(this.SchoolId).subscribe((actions) => {
//       this.createMarks = actions.map((action) => action.payload.doc.data() as CreateMarks);
    
//       this.filteredmark = this.filterstudent.map((student) => {
//         const marks = this.createMarks.find((mark) => mark.stud_id === student.id);
//         return {
//           student,
//           marks: marks || new CreateMarks(), 
//         };
//       });
    
//       console.log(this.filteredmark, 'check');
//     });
   
   
//   },
//   (error) => {
//     console.error('Error fetching address book data:', error);
//   }
// );
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];
    
   
  }

  changeTab(tab: string) {
    console.log(this.currentTab = tab,'check')
    this.currentTab = tab;
  }

  getcomp(compId: string): string {
    const comp = this.comprehensions.find((d) => d.id === compId);
    return comp ? comp.title :'No Driver Assign';
  }

  getcompqute(compId: string): string {
    const comp = this.comprehensions.find((d) => d.id === compId);
    return comp && comp.questions ? comp.questions.length.toString() : 'No Driver Assign';
    
  }

  getlist(kgtestid: string): string {
    const comp = this.addlists.find((d) => d.id === kgtestid);
    return comp ? comp.name: 'No Driver Assign';
    
  }
  

  getcompno(compId: string): string {
    const comp = this.comprehensions.find((d) => d.id === compId);
    return comp ? String(comp.no) : 'No Driver Assign';
}


editComprehension(compId: string, index: number) {


  this.deleteRecordModal?.show();

  const selectedComprehension = this.comprehensions.find((d) => d.id === compId);
  this.apiService.getScoreData(this.SchoolId, this.ScoreId).subscribe(actions => {
    this.score = actions.map(action => action.payload.doc.data() as Score);
    this.score = this.score.filter(score => score.stuid === this.studentid);
    this.scoreform = this.score.filter(score => score.compid === compId);
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

        this.deleteRecordModal?.onHidden.subscribe(() => {
          this.MessageFormData.reset();
        });
      }
    }
  }
}
// Kg Sheet
getOverallTotal(marks: { [key: string]: number }): number {
  return Object.values(marks).reduce((total, mark) => total + mark, 0);
}


}








