import { Component } from '@angular/core';
import { Van } from '../api/addvanobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  breadCrumbItems!: Array<{}>;
  Vans: Van[] = [];
  MessageFormData: FormGroup;
  
  constructor( ){
  this.MessageFormData = new FormGroup({  
    'vanid': new FormControl('', Validators.required),  
    'chassis': new FormControl('', Validators.required),  
    'disel': new FormControl('', Validators.required),  
    'engno': new FormControl('', Validators.required),  
    'seats': new FormControl('', Validators.required),  
 

  }); 
}
save(){}
}