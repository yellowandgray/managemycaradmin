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
    await this.fetchUserData();
    this.dataSubscription = this.apiService.getQueriesData().subscribe(
      (actions) => {
        this.garages = actions.map((action) => action.payload.doc.data() as Queries);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching address book data:', error);
        this.loading = false;
       
      }
    );


  }

  async fetchUserData() {
    try {
      const response = await this.apiService.getUsers().toPromise();
      console.log(response);
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.usersdata = response.data; // Assuming data is an array of users
      } else {
        this.usersdata = []; // Initialize as an empty array if data is not in the expected format
        console.error('Invalid data format: ', response);
      }
      console.log(this.usersdata);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching users: ', error);
      this.usersdata = []; // Initialize as an empty array if an error occurs
      this.loading = false;
    }
  }

    
  getUserById(userId: string): string {
    console.log(userId);
    const user = this.usersdata.find((user: any) => user.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : 'No User Assigned';
}


}
