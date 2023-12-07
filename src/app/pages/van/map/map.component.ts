import { Component } from '@angular/core';
import { Van } from '../api/addvanobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Route } from '../api/routeobj';
import { Driver } from '../../address-book/api/driverobj';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  breadCrumbItems!: Array<{}>;
  Vans: Van[] = [];
  Drivers: Driver[] = [];
  routes: Route[] = [];
  selectedRegNo: string='';
  selectedPic: string='';

  MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  constructor(private apiService: ApiService,private firestore: AngularFirestore ){
  this.MessageFormData = new FormGroup({  
    'vanid': new FormControl('', Validators.required),  
    'chassis': new FormControl('', Validators.required),  
    'disel': new FormControl('', Validators.required),  
    'engno': new FormControl('', Validators.required),  
    'seats': new FormControl('', Validators.required),  
 

  }); 
}

ngOnInit() {

  this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
    this.routes = actions.map(action => action.payload.doc.data() as Route);
 
  });
  
  this.apiService.getVanData(this.SchoolId,this.vanId).subscribe(actions => {
    this.Vans = actions.map(action => action.payload.doc.data() as Van);
    
  },(error) => {
    console.error('Error fetching arrivals', error);
   
  });


   
  this.apiService.getDriverData(this.SchoolId).subscribe(actions => {
    this.Drivers = actions.map(action => action.payload.doc.data() as Driver);

  });
}

updateSelectedPic() {
  console.log(   this.Vans.find((van) => van.regno === this.selectedRegNo),'check')
  const selectedVan = this.Vans.find((van) => van.regno === this.selectedRegNo);

  if (selectedVan) {
    this.selectedPic = selectedVan.pic;
  } else {

    this.selectedPic = ''; 
  }
}

save(){}
}