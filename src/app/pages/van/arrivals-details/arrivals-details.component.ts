import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Route } from '../api/routeobj';
import { ActivatedRoute, Router } from '@angular/router';
import { Arrival } from '../api/arrivalobj';
import { Driver } from '../../address-book/api/driverobj';
import { Van } from '../api/addvanobj';
import { ArrivalDetails } from '../api/mapobj';
import { Location } from '@angular/common';
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
  routeno: string | null;
  driverid: string | null;
  constructor(private apiService: ApiService, private route: ActivatedRoute,private location: Location ) {
    this.routeno = '';
    this.driverid=''
  }
ngOnInit(){
  this.route.paramMap.subscribe((params) => {
    this.routeno = params.get('routeno');
    this.driverid = params.get('driverid');

    this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
      this.routes = actions.map(action => action.payload.doc.data() as ArrivalDetails);
      this.routedetail=this.routes.filter(routes => routes.rno === this.routeno);
    });

    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.arrivals=this.arrivals.filter(arrival => arrival.rno === this.routeno);
      },
    );
    this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
      this.Drivers = actions.map(action => action.payload.doc.data() as Driver);
      this.filteredDrivers=this.Drivers.filter(driver => driver.driverid === this.routedetail[0].driverid);
  
    });
    this.apiService.getVanData(this.SchoolId,this.vanId).subscribe(actions => {
      this.Vans = actions.map(action => action.payload.doc.data() as Van);
      this.fildervan=this.Vans.filter(van => van.vanid === this.routedetail[0].vanid);
    });
    
  });
  console.log(this.routes,'check')

}
goBack() {
  this.location.back();
}

}
