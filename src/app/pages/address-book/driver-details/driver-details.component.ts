import { Component } from '@angular/core';
import { Driver } from '../api/driverobj';
import { ApiService } from '../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent {
  Drivers: Driver[] = [];
  driverdetails:Driver[] = [];
  driverid:string |null;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  constructor(private apiService: ApiService,private route: ActivatedRoute,private location: Location  ) {this.driverid = '';}
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.driverid = params.get('driverid');
  
      this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
        this.Drivers = actions.map(action => action.payload.doc.data() as Driver);
        this.driverdetails=this.Drivers.filter(driver => driver.driverid === this.driverid);
      });
      
    });
  
  }
  goBack() {
    this.location.back();
  }
}
