import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Route } from '../api/routeobj';
import { ActivatedRoute, Router } from '@angular/router';
import { Arrival } from '../api/arrivalobj';
import { Driver } from '../../address-book/api/driverobj';
import { Van } from '../api/addvanobj';
import { ArrivalDetails } from '../api/mapobj';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-arrivals-details',
  templateUrl: './arrivals-details.component.html',
  styleUrls: ['./arrivals-details.component.scss']
  
})
export class ArrivalsDetailsComponent {
  breadCrumbItems!: Array<{}>;
  routes: ArrivalDetails[] = [];
  routedetail:ArrivalDetails[] = [];
  Drivers: Driver[] = [];
  filteredDrivers:Driver[] = [];
  emp: ArrivalDetails =new ArrivalDetails();
  arrivals: Arrival[] = [];
  Vans: Van[] = [];
  fildervan:Van[]=[];
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  selectedOption: string = 'All';
  filteredArrivals: Arrival[] = [];
  routeno: string | null;
  driverid: string | null;
  searchTerm: string = ''; 
  constructor(private apiService: ApiService, private route: ActivatedRoute,private location: Location ) {
    this.routeno = '';
    this.driverid=''
  }
ngOnInit(){
  this.route.paramMap.subscribe((params) => {
    this.routeno = params.get('routeno');
    this.driverid = params.get('driverid');

    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.arrivals=this.arrivals.filter(arrival => arrival.rno === this.routeno);
        this.filteredArrivals=[...this.arrivals];
        
      },
    );
    this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
      this.routes = actions.map(action => action.payload.doc.data() as ArrivalDetails);
     
      this.routedetail=this.routes.filter(route => route.rno === this.routeno);
    });

  
    this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
      this.Drivers = actions.map(action => action.payload.doc.data() as Driver);
      this.filteredDrivers=this.Drivers.filter(driver => driver.driverid === this.routedetail[0].driverid);
  
    });
    this.apiService.getVanData(this.SchoolId,this.vanId).subscribe(actions => {
      this.Vans = actions.map(action => action.payload.doc.data() as Van);
      this.fildervan=this.Vans.filter(van => van.vanid === this.routedetail[0].vanid);
    });
    
  });

}
goBack() {
  this.location.back();
}



filterItemsByOption() {
  this.filteredArrivals = this.arrivals.filter(data => {
    if (this.selectedOption === 'All') {
      return true; 
    } else if (this.selectedOption === 'On time') {
      return data.arrivaltime < '09:15';
    } else if (this.selectedOption === 'Delay') {
      return data.arrivaltime >= '09:15';
    }
    return false;
  });
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
