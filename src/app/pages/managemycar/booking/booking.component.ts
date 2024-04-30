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
import { UserData } from '../api/userobj';
import { Garage } from '../api/garageobj';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  [x: string]: any;
  servicename:[]=[];
  breadCrumbItems: Array<any> = [];
  Bookdata: Booking []= []; 
  Bookdatas: any = []; 
  Bookdataspop: any = []; 
  selectedServices : any=[]; 
  usersdata: UserData[]=[];
  vehicles:any;
  garagesdata:Garage[] = []

  loading: boolean = true;
  searchTerm: string = '';

  filteredgarage: Booking[]=[];
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;

  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router,private datePipe: DatePipe ) {
    
  }


  async ngOnInit(): Promise<void> {
    this.apiService.getAddressBookData().subscribe(actions => {
      this.Bookdata = actions.map(action => action.payload.doc.data()as Booking);
      this.filteredgarage = [...this.Bookdata];
      this.callServiceForBookdata();
    });
    this.apiService.getusersData().subscribe(actions => {
      this.usersdata = actions.map(action => action.payload.doc.data()as UserData);
    });
    this.apiService.getVehiclesData().subscribe(actions => {
      this.vehicles = actions.map(action => action.payload.doc.data());
    });
    this.apiService.getGarageData().subscribe(actions => {
      this.garagesdata = actions.map(action => action.payload.doc.data()  as  Garage);
    });


    this.loading = false;
  }

  callServiceForBookdata(): void {
    for (let i = 0; i < this.filteredgarage.length; i++) {
      const bookingId = this.filteredgarage[i].id;
      console.log(bookingId,'booking ID'); 
      this.Service(bookingId); 
    }
  }

  
  getUserById(userId: string): string {
    const driver = this.usersdata.find((user) => user.id === userId);
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
            this.Bookdataspop = data.map(item => item); // Assuming data is an array of service objects
        } else {
            this.Bookdataspop = [];
        }
        this.selectedServices = this.Bookdataspop; 
        console.log(this.Bookdatas, 'Bookdatas');
        this.deleteModal?.show();
    }, error => {
        console.error("Error fetching service data:", error);
  
    });
}

// Service(bookingId: string): void {
//   this.apiService.getServiceData(bookingId).subscribe(data => {
//     if (Array.isArray(data)) {
//       console.log(data,'service data for booking ID:', bookingId); // Log service data for the booking ID
//       this.Bookdatas.push(data.map(item => item.name)); // Assuming data is an array of service objects
//     } else {
//       this.Bookdatas.push([]); // Push empty array if no service data found
//     }
//     console.log(this.Bookdatas, 'Bookdatas'); // Log Bookdatas after updating
//   }, error => {
//     console.error("Error fetching service data for booking ID:", bookingId, error); // Log error if any
//   });
// }
Service(bookingId: string): void {
  this.apiService.getServiceData(bookingId).subscribe(data => {
    if (Array.isArray(data)) {
      console.log(data, 'service data for booking ID:', bookingId); // Log service data for the booking ID
      const serviceNames = data.map(item => item.name);
      this.Bookdatas[bookingId] = serviceNames; // Store service names for this booking ID
    } else {
      this.Bookdatas[bookingId] = []; // Initialize empty array if no service data found
    }
    console.log(this.Bookdatas, 'Bookdatas'); // Log Bookdatas after updating
  }, error => {
    console.error("Error fetching service data for booking ID:", bookingId, error); // Log error if any
  });
}



  delet(id: string){
   this.apiService.deleteStudentData(id)
   this.deleteModal?.hide()
  }

  filteredBook(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterBook();
  }
 
 
  filterBook() {
    console.log('Filtering...', this.searchTerm);
  
    this.filteredgarage = this.Bookdata.filter(booking => {
      // Check if the user name, vehicle number, or garage name matches the search term
      const userMatch = this.getUserById(booking.userid).toLowerCase().includes(this.searchTerm.toLowerCase());
      const vehicleMatch = this.getvehiclesId(booking.vehicleId).toLowerCase().includes(this.searchTerm.toLowerCase());
      const garageMatch = this.getGarageId(booking.garageid).toLowerCase().includes(this.searchTerm.toLowerCase());
  
      // Return true if either user name, vehicle number, or garage name matches the search term
      return userMatch || vehicleMatch || garageMatch;
    });
  
    if (!this.filteredgarage.length) {
      console.log('No matching bookings...');
      this.filteredgarage = [];
      console.log(this.filteredgarage);
    }
  }
  
  


}
