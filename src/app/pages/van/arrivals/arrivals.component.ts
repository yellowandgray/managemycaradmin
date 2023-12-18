import { Component } from '@angular/core';
import { Arrival } from '../api/arrivalobj';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-arrivals',
 
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.scss']
})
export class ArrivalsComponent {
  breadCrumbItems!: Array<{}>;
  arrivals: Arrival[] = [];
  filteredTeachers:  Arrival[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage ) {}

  // ngOnInit() {
    
  //   this.apiService.getArrivalData(this.SchoolId,this.vanId).subscribe(actions => {
  //     this.arrivals = actions.map(action => action.payload.doc.data() as Arrival);
  //   });
  // }
  ngOnInit() {
    this.loading = true;
  
    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.filteredTeachers=[...this.arrivals];
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching arrivals', error);
        this.loading = false; 
      }
    );
  }
  
  // filteredArrival (event: any): void {
  //   const value = event.target.value;
  //   console.log('Filtering by name...', value);
  //   this.searchTerm = value;
  //   this.filterTeacher();
  // }
 
 
 
//   filterTeacher() {
//     console.log('Filtering...', this.searchTerm);

// console.log(this.arrivals)
//     this.filteredTeachers = this.arrivals.filter(arriv => {
//       console.log(arriv.date,'date')
//       const nameMatch = !this.searchTerm || arriv.date.toLowerCase().includes(this.searchTerm.toLowerCase());


//       return nameMatch;
//     });


//     if (!this.filteredTeachers.length) {
//       console.log('Nooo Students...');
//       this.filteredTeachers = [];
//       console.log(this.filteredTeachers);
//     }
//   }

filteredArrival(event: any): void {
  const value = event.target.value;

 
  const parsedDate = new Date(value);


  const formattedDate = formatDate(parsedDate, 'dd-MM-yyyy', 'en-US');

  console.log('Filtering by date...', formattedDate);


  this.searchTerm = formattedDate;
  console.log('Filtering searchTerm...', this.searchTerm );
  this.filterTeacher();
}
  filterTeacher() {
    console.log('Filtering...', this.searchTerm);

    this.filteredTeachers = this.arrivals.filter(arriv => {
      console.log('Filtering data...', arriv.date);
      const parsedDate = new Date(arriv.date);

  
      const formattedDate = formatDate(parsedDate, 'dd-MM-yyyy', 'en-US');

      const dateMatch = !this.searchTerm || formattedDate.includes(this.searchTerm);
      console.log('Filtering datsd...', dateMatch);
      return dateMatch;
    });

    if (!this.filteredTeachers.length) {
      console.log('No Students...');
      this.filteredTeachers = [];
      console.log(this.filteredTeachers);
    }
  }

}
