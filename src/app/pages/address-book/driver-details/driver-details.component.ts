import { Component } from '@angular/core';
import { Driver } from '../api/driverobj';
import { ApiService } from '../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Arrival } from '../../van/api/arrivalobj';
import * as moment from 'moment';
@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent {
  Drivers: Driver[] = [];
  driverdetails:Driver[] = [];
  arrivals: Arrival[] = [];
  filteredArrivals:Arrival[] = [];
  driverid:string |null;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  constructor(private apiService: ApiService,private route: ActivatedRoute,private location: Location  ) {this.driverid = '';}
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.driverid = params.get('driverid');
  
      this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
        this.Drivers = actions.map(action => action.payload.doc.data() as Driver);
        this.driverdetails=this.Drivers.filter(driver => driver.driverid === this.driverid);
      });
      
    });
    
  

    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.filteredArrivals =this.arrivals.filter(arrivals => arrivals.driid === this.driverid);
        
      },
      (error) => {
        console.error('Error fetching arrivals', error);
        // this.loading = false;
      }
    );
 
}
goBack() {
  this.location.back();
}
}