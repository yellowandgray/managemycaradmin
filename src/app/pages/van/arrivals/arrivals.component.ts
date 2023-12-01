import { Component } from '@angular/core';
import { Arrival } from '../api/arrivalobj';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.scss']
})
export class ArrivalsComponent {
  breadCrumbItems!: Array<{}>;
  arrivals: Arrival[] = [];
  loading: boolean = true;
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
  
    this.apiService.getArrivalData(this.SchoolId, this.vanId).subscribe(
      (actions) => {
        this.arrivals = actions.map((action) => action.payload.doc.data() as Arrival);
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching arrivals', error);
        this.loading = false; 
      }
    );
  }
  


}
