import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ApiService } from '../api/api.service';
import { Van } from '../api/addvanobj';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-van-details',
  templateUrl: './van-details.component.html',
  styleUrls: ['./van-details.component.scss']
})
export class VanDetailsComponent {
  Vans: Van[] = [];
  vandetail: Van[] = [];
  van:string |null;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';

  constructor(private apiService: ApiService,private route: ActivatedRoute ,private location: Location ){ this.van = '';}
 
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.van = params.get('van');
  
      this.apiService.getVanData(this.SchoolId,this.vanId).subscribe(actions => {
        this.Vans = actions.map(action => action.payload.doc.data() as Van);
        this.vandetail=this.Vans.filter(van => van.vanid === this.van);
      });
      
    });
  
  }
  goBack() {
    this.location.back();
  }
}
