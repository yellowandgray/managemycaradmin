import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User, Vehicle } from '../api/userobj';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  breadCrumbItems!: Array<{}>;
  loading: boolean = true;
  allvehicle: any[] = [];

  
  usersdata: any;




  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {}


  ngOnInit() {
    this.loading= true;
    this.apiService.getUsers().subscribe(
      (data) => {
           console.log(data)
        this.usersdata = data;
        this.loading = false;
     
      },
      (error) => {
        console.error('Error fetching users: ', error);
        this.loading = false;
      }
    );
  }
  async fetchVehicle(id: string): Promise<number> {
    try {
      const response = await this.apiService.getvehicles().toPromise();
      console.log(response);
  
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.allvehicle = response.data.filter((vehicle: any) => vehicle.userId === id);
        console.log('Filtered Vehicles:', this.allvehicle.length);
        return this.allvehicle.length; // Return the length of filtered vehicles
      } else {
        this.allvehicle = [];
        console.error('Invalid data format: ', response);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching vehicles: ', error);
      this.allvehicle = [];
      return 0; // Return 0 in case of error
    }
  }
  

  
  details(id: string, firstname: string, lastname: string) {
    this.router.navigate(['/uservehicledetails'], { queryParams: { id: id, firstname: firstname, lastname: lastname } });
}

  
 

}
