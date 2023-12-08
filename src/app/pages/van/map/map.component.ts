import { Component, ViewChild } from '@angular/core';
import { Van } from '../api/addvanobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Route } from '../api/routeobj';
import { Driver } from '../../address-book/api/driverobj';
import { co } from '@fullcalendar/core/internal-common';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { RouteMap } from '../api/mapobj';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  breadCrumbItems!: Array<{}>;
  Routeid: string='';
  selectedRouteNo: string = '';
  map:RouteMap[]=[];
  Vans: Van[] = [];
  Drivers: Driver[] = [];
  routes: Route[] = [];
  Vanid: string = '';
  selectedRegNo: string = '';
  selectedPic: string='';
  selectedYear: string = '';
  Seat: string = '';
  Diesel: string = '';

  selectedDriver: string = '';
  selectedDriverPic: string = '';
  Driverid:string = '';
  year: string='';
  town: string='';
  phone: string='';
  // MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore ){
  // this.MessageFormData = new FormGroup({  
  //   'vanid': new FormControl('', Validators.required),  
  //   'chassis': new FormControl('', Validators.required),  
  //   'disel': new FormControl('', Validators.required),  
  //   'engno': new FormControl('', Validators.required),  
  //   'seats': new FormControl('', Validators.required),  
 

  // }); 
  // this.fetchVanData();
}

ngOnInit() {

  this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
    this.map = actions.map(action => action.payload.doc.data() as RouteMap);
 
  });
  
  this.apiService.getVanData(this.SchoolId, this.vanId).subscribe(
    (actions) => {
      this.Vans = actions.map((action) => action.payload.doc.data() as Van);
    },
    (error) => {
      console.error('Error fetching van data', error);
    }
  );


   
  this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
    this.Drivers = actions.map(action => action.payload.doc.data() as Driver);

  });
}



getDriverName(driverId: string): string {
  const driver = this.Drivers.find((d) => d.driverid === driverId);
  return driver ? driver.name : 'No Driver Assign';
}

getvanName(vanId: string): string {
  // console.log( this.Vans.find((d) => d.vanid === this.vanId))
  const vans = this.Vans.find((d) => d.vanid === vanId);
  return vans ? vans.regno : 'No Van Assign';
}

updateSelectedPic() {
  console.log('Selected registration number:', this.selectedRegNo);
  console.log('Vans array:', this.Vans);
  console.log('Vans array:', this.Seat);
  const selectedVan = this.Vans.find((van) => van.regno === this.selectedRegNo);

  if (selectedVan) {
    this.selectedPic = selectedVan.pic;
    this.selectedYear = selectedVan.year;
    this.Seat = selectedVan.seats;
    this.Diesel=selectedVan.disel;
    this.Vanid=selectedVan.vanid;
  } else {
    this.selectedPic = '';
    this.selectedYear = '';
    this.Seat='';
    this.Diesel='';
  }
}


updateSelectedDriverPic() {
  console.log('Selected registration number:', this.selectedDriver);
  console.log('Vans array:', this.Vans);
  console.log('Vans array:', this.Seat);
  const selectedDriver = this.Drivers.find((driver) => driver.name === this.selectedDriver);

  if (selectedDriver) {
    this.selectedDriverPic = selectedDriver.pic;
    this.year = selectedDriver.age;
    this.town = selectedDriver.town;
    this.phone=selectedDriver.phn;
    this.Driverid=selectedDriver.driverid
  } else {
    this.selectedDriverPic = '';
    this.year = '';
    this.town='';
    this.phone='';
  }
}
Selectedrouteid() {
  console.log('Selected registration number:', this.selectedRouteNo);
 
  const selectedRoute = this.map.find((route) => route.rno === this.selectedRouteNo);

  if (selectedRoute) {
    this.Routeid=selectedRoute.routeid
    console.log('Selected registration number:', this.Routeid);
  } else {
   
    this.Routeid='';
  } 

}

update(){
  this.apiService.updateRoutemapData(this.Routeid,this.SchoolId,this.vanId,this.Driverid,this.Vanid);
  this.showModal?.hide()
  // this.Routeid='';
// this.updateSelectedPic.reset()
}



save(){}
}