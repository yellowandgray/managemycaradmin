import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Student } from '../../address-book/api/addressobj';
import { Subscription } from 'rxjs';
import { CreateMarks } from '../api/studentmarkobj';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-mark-detail',
  templateUrl: './student-mark-detail.component.html',
  styleUrls: ['./student-mark-detail.component.scss']
})
export class StudentMarkDetailComponent {
  students: Student[] = [];
  filterstudent: Student[] = [];
  emp:CreateMarks = new CreateMarks();
  filteredmark: { student: Student; marks: CreateMarks }[] = [];
  marksList: { student: Student; marks: CreateMarks }[] = [];
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  examname:string |null;
  dataSubscription: Subscription | null = null;
  standards: string[] = [];
  testid:string |null;
  selectedStandard: string = 'standard';
  selectedOption: string = '';
  year:string |null;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private route: ActivatedRoute ) {this.examname = '';  this.standards = [];this.testid='';this.year='';}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.examname = params.get('examname');
      this.testid = params.get('testid');
      this.year = params.get('year');
      const selectedStandards = params.get('standards')?.split(',') ?? [];
      this.standards = selectedStandards;
  
      this.dataSubscription = this.apiService.getAddressBookData().subscribe(
        (actions) => {
          this.students = actions.map((action) => action.payload.doc.data() as Student);
          this.students.sort((a, b) => a.name.localeCompare(b.name));
       
          this.filterstudent = this.students.filter((student) => this.standards.includes(student.standard));
  
         
          this.marksList = this.filterstudent.map((student) => ({
            student,
            marks: new CreateMarks(),
          }));
       this.filteredmark= this.filterstudent.map((student) => ({
        student,
        marks: new CreateMarks(),
      }));
        },
        (error) => {
          console.error('Error fetching address book data:', error);
        }
      );
    });
  }
  
  // save(){
  //   this.apiService.createMarkstData(this.marksList,this.SchoolId);
  // }
  // save() {
  //   for (const mark of this.marksList) {
  //     this.apiService.createMarkstData(mark.marks, this.SchoolId);
  //   }
  // }
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
  save() {
    for (const mark of this.filteredmark) {
      if (mark.marks.marks.tamil || mark.marks.marks.english || mark.marks.marks.mathematics || mark.marks.marks.science || mark.marks.marks.history) {
        this.apiService.createMarkstData(mark.marks, this.SchoolId, mark.student.id,this.testid,this.year);
      }
    } this.position() 
}


// filterItemsByOption() {
//   this.filteredmark = this.marksList.filter(mark => {
//     const batchSection = this.selectedOption === 'all' || mark.student.section === this.selectedOption;
  
   
//     return batchSection 
//   });
// }
// filterItemsByOption1() {
//   this.filteredmark = this.marksList.filter(mark => {
  
//     const batchstandard=this.selectedStandard ==='standard'|| mark.student.standard==this.selectedStandard;
//     return batchstandard
//   });
// }
filterItemsByOption() {
  this.filteredmark = this.marksList.filter(mark => {
    const batchSection = this.selectedOption === 'all' || mark.student.section === this.selectedOption;
    const batchStandard = this.selectedStandard === 'standard' || mark.student.standard === this.selectedStandard;

    return (batchSection || batchStandard);
  });
}

}