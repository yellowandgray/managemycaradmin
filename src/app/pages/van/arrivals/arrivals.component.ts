import { Component } from '@angular/core';
import { Arrival } from '../api/arrivalobj';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-arrivals',
 
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.scss']
})
export class ArrivalsComponent {
  breadCrumbItems!: Array<{}>;
  arrivals: Arrival[] = [];
  filteredArrivals:  Arrival[] = [];
  searchTerm: string = moment().format('YYYY-MM-DD'); 
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
  
    
    this.searchTerm = moment().format('YYYY-MM-DD');
  
    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.filterTeacher(); 
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching arrivals', error);
        this.loading = false;
      }
    );
  }


filteredArrival(event: any): void {
  const value = event.target.value;
  console.log('Filtering by date...', value);
  this.searchTerm = value;
  console.log(this.searchTerm, 'date');
  this.filterTeacher();
}

filterTeacher() {
  console.log('Filtering...', this.searchTerm);
  console.log(this.arrivals, 'arrival');

  this.filteredArrivals = this.arrivals.filter((arriv) => {
    console.log(arriv.date, 'date');

    const formattedDate = moment(arriv.date, 'DD-MM-YYYY').format('YYYY-MM-DD').toLowerCase();
    const searchTermLower = this.searchTerm.toLowerCase();
    const dateMatch = !searchTermLower || formattedDate.includes(searchTermLower);

    console.log(dateMatch, 'match');
    return dateMatch;
  });

  if (!this.filteredArrivals.length) {
    console.log('No Students...');
    this.filteredArrivals = [];
    console.log(this.filteredArrivals);
  }
}





}
