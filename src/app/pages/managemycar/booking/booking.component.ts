// import { Component, ViewChild } from '@angular/core';
import { Booking } from '../api/bookingobj';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  [x: string]: any;
  servicename:[]=[];
  breadCrumbItems!: Array<{}>;
  Bookdata: any = []; 
  Bookdatas: any = []; 
  selectedServices : any=[]; 
  usersdata: any;
  vehicles:any;
  garagesdata:any;
  loading: boolean = true;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router,private datePipe: DatePipe ) {
    
  }


  async ngOnInit(): Promise<void> {


    this.apiService.getAddressBookData().subscribe(actions => {
      this.Bookdata = actions.map(action => action.payload.doc.data() );
      console.log(this.Bookdata,'check')
    });
    this.apiService.getusersData().subscribe(actions => {
      this.usersdata = actions.map(action => action.payload.doc.data() );
    });
    this.apiService.getVehiclesData().subscribe(actions => {
      this.vehicles = actions.map(action => action.payload.doc.data() );
    });
    this.apiService.getGarageData().subscribe(actions => {
      this.garagesdata = actions.map(action => action.payload.doc.data() );
      // console.log(this.garagesdata,'check')
    });
    
    this.loading = false;
   console.log(this.garagesdata,'check')
  }
  
  // async fetchBookingData() {
  //   return new Promise<void>((resolve, reject) => {
  //     this.apiService.getBooking().subscribe(
  //       (response) => {
  //         if (response && response.status === 'Success' && response.bookings) {
  //           this.Bookdata = response.bookings;
  //           console.log(this.Bookdata, 'check');
            
  //           resolve();
  //         } else {
  //           console.error('Invalid response format:', response);
           
  //           reject('Invalid response format');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching bookings: ', error);
        
  //         reject(error);
  //       }
  //     );
  //   });
  // }
  // async fetchUserData() {
  //   try {
  //     const response = await this.apiService.getUsers().toPromise();
  //     console.log(response);
  //     if (response && response.status === 'Success' && Array.isArray(response.data)) {
  //       this.usersdata = response.data; // Assuming data is an array of users
  //     } else {
  //       this.usersdata = []; // Initialize as an empty array if data is not in the expected format
  //       console.error('Invalid data format: ', response);
  //     }
  //     console.log(this.usersdata);
     
  //   } catch (error) {
  //     console.error('Error fetching users: ', error);
  //     this.usersdata = []; // Initialize as an empty array if an error occurs
     
  //   }
  // }


  // async fetchVehicle()  {
  //   try {
  //     const response = await this.apiService.getvehicles().toPromise();
  //     console.log(response);
  //     if (response && response.status === 'Success' && Array.isArray(response.data)) {
  //       this.vehicles = response.data; // Assuming data is an array of users
  //     } else {
  //       this.vehicles = []; // Initialize as an empty array if data is not in the expected format
  //       console.error('Invalid data format: ', response);
  //     }
  //     console.log(this.vehicles);
     
  //   } catch (error) {
  //     console.error('Error fetching users: ', error);
  //     this.vehicles = []; 
      
  //   }
  // }


  // async fetchGarages()  {
  //   try {
  //     const response = await this.apiService.getGarages().toPromise();
  //     console.log("Garages API Response:", response);
  //     if (response && response.status === 'Success' && Array.isArray(response.data)) {
  //       this.garagesdata = response.data;
  //       this.loading = false;
  //     } else {
  //       console.error('Invalid data format or no data returned from garages API');
  //       this.loading = false;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching garages: ', error);
  //     
  //   }
  // }
  
    
  getUserById(userId: string): string {
    const driver = this.usersdata.find((user:any) => user.id === userId);
    return driver ? `${driver.firstname} ${driver.lastname}`: 'No User Assigned';
  }

  getvehiclesId(userId: string): string {
    const vehicles = this.vehicles.find((user:any) => user.vehicleid === userId);
    return vehicles ? vehicles.vehicleno : 'No vehicles Assigned';
  }

  getGarageId(garageId: string): string {
    const garage = this.garagesdata.find((garage: any) => garage.id === garageId);
    return garage ? garage.name : 'No garage Assigned';
  }
  
 
  deletpop(id: string) {
    console.log(id);
    this.apiService.getServiceData(id).subscribe(data => {
        console.log(data); // Check the data received from Firestore
        if (Array.isArray(data)) {
            this.Bookdatas = data.map(item => item); // Assuming data is an array of service objects
        } else {
            this.Bookdatas = [];
        }
        this.selectedServices = this.Bookdatas; 
        console.log(this.Bookdatas, 'Bookdatas');
        this.deleteModal?.show();
    }, error => {
        console.error("Error fetching service data:", error);
  
    });
}

   Service(id:string): void{
    this.apiService.getServiceData(id).subscribe(data => {
      console.log(data); // Check the data received from Firestore
      if (Array.isArray(data)) {
          this.Bookdatas = data.map(item => item.name); // Assuming data is an array of service objects
      } else {
          this.Bookdatas = [];
      }
    this.servicename=this.Bookdatas
      console.log(this.Bookdatas, 'Bookdatas');
      
      // return this.Bookdatas; 
  }, error => {
      console.error("Error fetching service data:", error);

  });
}


  delet(id: string){
   this.apiService.deleteStudentData(id)
   this.deleteModal?.hide()
  }
  onsubmit(){
   
  }


  
  add(){

    // this.deleteRecordModal?.show()
    // this.emp = new Booking();
 
  }
 

  save() {
// console.log("student data",this.emp);
// this.apiService.createStudentData(this.emp);
// this.deleteRecordModal?.hide()

  }

 


}
