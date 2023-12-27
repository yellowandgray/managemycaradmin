import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Student } from '../../address-book/api/addressobj';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-mark-detail',
  templateUrl: './student-mark-detail.component.html',
  styleUrls: ['./student-mark-detail.component.scss']
})
export class StudentMarkDetailComponent {
  students: Student[] = [];
  filterstudent: Student[] = [];
  examname:string |null;
  dataSubscription: Subscription | null = null;
  standard: string[] = [];
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private route: ActivatedRoute ) {this.examname = '';  this.standard = [];}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.examname = params.get('examname');
      const selectedStandard = params.get('standard') ?? '';
      this.standard = [selectedStandard];
  
      this.dataSubscription = this.apiService.getAddressBookData().subscribe(
        (actions) => {
          this.students = actions.map((action) => action.payload.doc.data() as Student);
          this.students.sort((a, b) => a.name.localeCompare(b.name));
  
          this.filterstudent = this.students.filter((student) => this.standard[0].includes(student.standard));
        },
        (error) => {
          console.error('Error fetching address book data:', error);
        }
      );
    });
  }
  
 
 
}