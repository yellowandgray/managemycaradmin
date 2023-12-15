import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route } from '../api/routeobj';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss']
})
export class RouteDetailComponent {
  breadCrumbItems!: Array<{}>;

  routes: Route[] = [];
  routedetail:Route[] = [];
  emp: Route =new Route();

  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';
  routeno: string | null;
 
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.routeno = '';
  }
ngOnInit(){
  this.route.paramMap.subscribe((params) => {
    this.routeno = params.get('routeno');

    this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
      this.routes = actions.map(action => action.payload.doc.data() as Route);
      this.routedetail=this.routes.filter(routes => routes.rno === this.routeno);
    });
    
  });

}

}

