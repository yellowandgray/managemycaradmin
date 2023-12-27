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
  // searchTerm: string = moment().format('YYYY-MM-DD'); 
  fromDate: string = moment().format('YYYY-MM-DD');
  toDate: string = moment().format('YYYY-MM-DD');

  loading: boolean = true;
  selectedOption: string = 'All';

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
  
    
    this.fromDate = moment().format('YYYY-MM-DD');

    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.arrivals.sort((a, b) => {
          const rnoA = parseInt(a.rno, 10); 
          const rnoB = parseInt(b.rno, 10);
    
          return rnoA - rnoB;
        });
    
        this.filterItems(); 
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching arrivals', error);
        this.loading = false;
      }
    );
    
  
    // this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
    //   (actions) => {
    //     this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
    //     this.filterItems(); 
    //     this.loading = false;
    //   },
    //   (error) => {
    //     console.error('Error fetching arrivals', error);
    //     this.loading = false;
    //   }
    // );
  }



filterItems(): void {
  console.log('Filtering by date range and arrival time option...', this.fromDate, this.toDate, this.selectedOption);

  this.filteredArrivals = this.arrivals.filter((arriv) => {
    const formattedDate = moment(arriv.date, 'DD-MM-YYYY').format('YYYY-MM-DD').toLowerCase();
    const fromSearchTerm = this.fromDate.toLowerCase();
    const toSearchTerm = this.toDate.toLowerCase();

    const dateMatch = (!fromSearchTerm || formattedDate >= fromSearchTerm) &&
      (!toSearchTerm || formattedDate <= toSearchTerm);

    let timeMatch = false;
    if (this.selectedOption === 'All') {
      timeMatch = true;
    } else if (this.selectedOption === 'On time') {
      timeMatch = arriv.arrivaltime <= '09:15';
    } else if (this.selectedOption === 'Delay') {
      timeMatch = arriv.arrivaltime > '09:15';
    }

    console.log(dateMatch, 'date match', timeMatch, 'time match');
    return dateMatch && timeMatch;
  });

  if (!this.filteredArrivals.length) {
    console.log('No Students...');
    this.filteredArrivals = [];
    console.log(this.filteredArrivals);
  } else {
    // Sort the filtered arrivals by date
    this.filteredArrivals.sort((a, b) => {
      const dateA: any = moment(a.date, 'DD-MM-YYYY').toDate();
      const dateB: any = moment(b.date, 'DD-MM-YYYY').toDate();
      return dateA - dateB;
    });
  }
}



}
