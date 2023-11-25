import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Route } from '../api/routeobj';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-addroute',
  templateUrl: './addroute.component.html',
  styleUrls: ['./addroute.component.scss']
})
export class AddrouteComponent {
  breadCrumbItems!: Array<{}>;
  routes: Route[] = [];
  emp: Route =new Route();
  MessageFormData: FormGroup;
  SchoolId:string='stZWDh06GmAGgnoqctcE';
  vanId:string='FODMJA3V33EWUiSDFM5F';

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal?: ModalDirective;
 
//  @ViewChild('deleteRecordModal2', { static: false }) deleteRecordModal2?: ModalDirective;
  // @ViewChild('deleteRecordModal2') deleteRecordModal2: any;
  // @ViewChild('deleteRecordModal') deleteRecordModal: any;
 
  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage )
  {
   
    this.MessageFormData = new FormGroup({  
      'rno': new FormControl('', Validators.required),  
      'routeid': new FormControl('', Validators.required),  
      'desti': new FormControl('', Validators.required),  
      'routedetails': new FormControl('', Validators.required),  
      'start': new FormControl('', Validators.required),  
      'stop1': new FormControl('', Validators.required),  
      'stop2': new FormControl('', Validators.required),  
      'stop3': new FormControl('', Validators.required),  

    });  
   

   
       
    if (this.emp != null) {

      this.MessageFormData.patchValue({       
        rno: this.emp.rno,
        routeid: this.emp.routeid,
        routedetails: this.emp.routedetails,
        desti: this.emp.desti, 
        start:  this.emp.start,   
        stop1:  this.emp.stop1,  
        stop2:  this.emp.stop2,  
        stop3: this.emp.stop3,
      
 
      });
      // this.key = this.data.data.key;
    
      this.emp.rno= this.emp.rno,
      this.emp.routeid=this.emp.routeid,
      this.emp.routedetails= this.emp.routedetails,
      this.emp.desti= this.emp.desti, 
      this.emp.start= this.emp.start,   
      this.emp.stop1=  this.emp.stop1,  
      this.emp.stop2=  this.emp.stop2,  
      this.emp.stop3= this.emp.stop3
      // this.emp.eyal_id= this.data.data.eyal_id;  
    }
  }
  ngOnInit() {
    
    this.apiService.getRouteData(this.SchoolId,this.vanId).subscribe(actions => {
      this.routes = actions.map(action => action.payload.doc.data() as Route);
    });
  }

 



save() {
   
   console.log(this.emp);  
   this.apiService.createRouteData(this.emp,this.SchoolId,this.vanId);
    this.emp = new Route();
  this.showModal?.hide()
}





 update(id: string)
 {
   this.apiService.updateRouteData(id.toString(),this.emp,this.SchoolId,this.vanId);
   this.emp = new Route();
   this.editModal?.hide(); 
  //  this.resetForm;

 }
 
 editRoute(index: number) {
  const selectedRoute = this.routes[index];
  this.emp = { ...selectedRoute }; // Copy selected Route data to emp object
  
  this.MessageFormData.patchValue({
    rno: this.emp.rno,
    routedetails: this.emp.routedetails,
    desti: this.emp.desti, 
    start:  this.emp.start,   
    stop1:  this.emp.stop1,  
    stop2:  this.emp.stop2,  
    stop3: this.emp.stop3,
  });
  this.editModal?.show();

 
}

delet(id: string){
  this.apiService.deleteRouteData(id,this.SchoolId,this.vanId)
    }



}