import { Component, ViewChild } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Queries } from '../api/queriesobj';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent {
 
  garages: Queries[] = [];


  deleteId:string='';


 

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  isSubmitted = false;
  files: File[] = [];
  dataSubscription: Subscription | null = null;
 
  selectedImage: any = null;
  loading: boolean = true;


  selectedStandard: string = '';

  usersdata: any;
  


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




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;






 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {
    
  }


  async ngOnInit() {

    this.loading= true;

    this.dataSubscription = this.apiService.getQueriesData().subscribe(
      (actions) => {
        this.garages = actions.map((action) => action.payload.doc.data() as Queries);
        this.loading = false;
        
        this.apiService.getusersData().subscribe(actions => {
          this.usersdata = actions.map(action => action.payload.doc.data());
        });
      },
      
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
       
      }
    );


  }

 

    
  getUserById(userId: string): string {
    console.log(userId);
    const user = this.usersdata.find((user: any) => user.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : 'No User Assigned';
}
formatDateTime(dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
  
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  return dateTime.toLocaleString('en-US', options);
}


}
