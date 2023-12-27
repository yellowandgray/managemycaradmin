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
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  breadCrumbItems!: Array<{}>;
  Routeid: string='';
  selectedRouteNo: string = '';
  filteredMaps: RouteMap[] = [];
  emp: RouteMap =new RouteMap();
  
  filteredVans: Van[] = [];
 
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
  // editForm: FormGroup;
  searchMap: string = '';
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal?: ModalDirective;
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private fb: FormBuilder ){
  
   
      // this.emp.rno = this.selectedRouteNo,
      // this.emp. routeid= this.selectedRegNo,
      // this.emp.vanid= this.emp.vanid,
      // this.emp.driverid= this.selectedDriver
  
 
}

ngOnInit() {

  this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
    this.map = actions.map(action => action.payload.doc.data() as RouteMap);
    this.map.sort((a, b) => {
      const rnoA = parseInt(a.rno, 10); 
      const rnoB = parseInt(b.rno, 10);

      return rnoA - rnoB;
    });
    this.filteredMaps = [...this.map];
 
  });
  
    this.apiService.getVanData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.Vans = actions.map((action) => action.payload.doc.data() as Van);
        this.filteredVans = [...this.Vans];
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
 
  const selectedRoute = this.map.find((route) => route.rno === this.selectedRouteNo);

  if (selectedRoute) {
    this.Routeid=selectedRoute.routeid
  } else {
   
    this.Routeid='';
  } 

}

update(){
  this.apiService.updateRoutemapData(this.Routeid,this.SchoolId,this.vanId,this.Driverid,this.Vanid );
  this.showModal?.hide()
  this.editModal?.hide()

  // this.Routeid='';
// this.updateSelectedPic.reset()
}


open(){
this.selectedRouteNo='';
this.selectedRegNo='';
this.selectedDriver=''
  this.showModal?.show()
}


editmap(rno: string,van:string,driver:string) {
  this.selectedRouteNo=rno;
  this.selectedRegNo=van;
  this.selectedDriver=driver;
  this.Selectedrouteid() ;
  this.updateSelectedPic();
  this.updateSelectedDriverPic();
  this.editModal?.show();
}

filteredMap(event: any): void {
  const value = event.target.value;
  this.searchMap = value;
  this.filterTeacher();
}


filterTeacher(): void {

  this.filteredMaps = this.map.map((map) => ({ ...map, source: 'map' })).filter((map) => {
    const nameMatch = !this.searchMap || map.rno.toLowerCase().includes(this.searchMap.toLowerCase());
    return nameMatch;
  });

  this.filteredVans = this.Vans.map((van) => ({ ...van, source: 'van' })).filter((van) => {
    const nameMatch = !this.searchMap || van.regno.toLowerCase().includes(this.searchMap.toLowerCase());
    return nameMatch;
  });

  if (!this.filteredVans.length) {
    console.log('No Vans...');
  }
  if (!this.filteredMaps.length) {
    console.log('No Maps...');
  }
}

// editmap(index: number){  this.editModal?.show();}
// editmap(index: number) {
//   this.editModal?.show();
//   const selectedComprehension = this.map[index];

//   if (selectedComprehension) {
//     this.editForm.patchValue({
//       rno: selectedComprehension.rno,
//       vanid: selectedComprehension.vanid, 
//       driverid: selectedComprehension.driverid,
//     });
//   }
// }

save(){}
saveChanges() {

  // const routeNo = this.editForm.get('rno').value;
  // const vanNo = this.editForm.get('vanid').value;
  // const driverName = this.editForm.get('driverName').value;

  // this.apiService.updateRoutemapData(routeNo, this.SchoolId, vanNo, driverName,);

  // // Close the modal
  // this.editModal?.hide();


}
}