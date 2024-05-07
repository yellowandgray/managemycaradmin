import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../api/api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserData, Vehicle } from '../api/userobj';
import { Booking } from '../api/bookingobj';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  breadCrumbItems: Array<any> = [];
  loading: boolean = true;
  allvehicle: any[] = [];
  searchTerm: string = '';
  Bookdata: Booking []= []; 
  usersdata: UserData[] =  [] ;
  filteredUser: UserData[]=[];
  vehicalno: any = {}; 
  bookno: any = {}; 
  isLoading: { [key: string]: boolean } = {}; 
  isLoadingVehicle: { [key: string]: boolean } = {};
  selectedPreviewImage: string | null = null;
  @ViewChild('showModals', { static: false }) showModals?: ModalDirective;




  @ViewChild('showModals1', { static: false }) showModals1?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal?: ModalDirective;
 


  constructor(private apiService: ApiService,private firestore: AngularFirestore,private storage: AngularFireStorage,private router: Router, ) {}


  ngOnInit() {
    this.loading= true;
    // this.callServiceForBookdata();
    this.apiService.getusersData().subscribe(actions => {
      this.usersdata = actions.map(action => action.payload.doc.data()as UserData );
      this.filteredUser=[...this.usersdata]
      this.callServiceForBookdata();
      
    });
    this.loading = false;
 
  
  }



  callServiceForBookdata(): void {
    if (Array.isArray(this.usersdata)) {
      this.usersdata.forEach((user: any) => {
        console.log(user)
        this.Booking(user.id);
        this.Vehicle(user.id);
        
      });
    } else {
      console.error('Invalid data format: ', this.usersdata);
    }
  }



  Vehicle(id: string) {
    this.isLoadingVehicle[id] = true; // Set loading state to true
    this.apiService.getvehicles().subscribe(
        (response: any) => {
            if (response && response.status === 'Success' && Array.isArray(response.data)) {
                const vehicles = response.data.filter((vehicle: any) => vehicle.userId === id);
                // console.log('Filtered Vehicles:', vehicles.length);
                this.vehicalno[id] = vehicles.length; // Store vehicle count for this user
            } else {
                console.error('Invalid data format: ', response);
            }
        },
        (error) => {
            console.error('Error fetching vehicles: ', error);
        },
        () => {
            this.isLoadingVehicle[id] = false; // Set loading state to false once the API call is completed
        }
    );
}


// Booking(id: string) {
//   console.log('check');
//   this.isLoadingVehicle[id] = true; 
//   console.log(this.apiService.getAddressBookData());// Set loading state to true
//   this.apiService.getAddressBookData().subscribe(
//       (response: any) => {
//           const vehicles = response.data.filter((vehicle: any) => vehicle.userId === id);
//           console.log('Filtered Booking:', vehicles);
//           this.bookno[id] = vehicles.length; // Store vehicle count for this user
       
//       },
//       (error: any) => {
//           console.error('Error fetching address book data:', error);
//           // Handle error if needed
//       }
//   );
// }

Booking(userId: string) {
  this.apiService.getAddressBookData().subscribe(actions => {
      // Assuming actions is an array of documents
      this.Bookdata = actions.map(action => action.payload.doc.data() as Booking);
      // console.log(this.Bookdata); // Logging inside subscribe to ensure it runs after data is fetched
      const vehicles = this.Bookdata.find(user => user.id === userId);
      console.log(vehicles, 'check');
  });
}

    


  async fetchVehicle(id: string): Promise<number> {
    try {
      const response = await this.apiService.getvehicles().toPromise();
      console.log(response);
  
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.allvehicle = response.data.filter((vehicle: any) => vehicle.userId === id);
        console.log('Filtered Vehicles:', this.allvehicle.length);
        return this.allvehicle.length;
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
  
  filteredGarage(event: any): void {
    const value = event.target.value;
    console.log('Filtering by name...', value);
    this.searchTerm = value;
    this.filterGarage();
  }
  
  filterGarage() {
    console.log('Filtering...', this.searchTerm);
  
    this.filteredUser = this.usersdata.filter(user => {
      // Combine first name and last name and check if it matches the search term
      const fullName = user.firstname.toLowerCase()+ user.lastname.toLowerCase();
      return fullName.includes(this.searchTerm.toLowerCase());
    });
  
    if (!this.filteredUser.length) {
      console.log('No matching users...');
      this.filteredUser = [];
      console.log(this.filteredUser);
    }
  }
  
  
  
  details(id: string, firstname: string, lastname: string) {
    this.isLoading[id] = true; // Set loading state to true
    this.router.navigate(['/uservehicledetails'], { queryParams: { id: id, firstname: firstname, lastname: lastname } })
        .finally(() => {
            this.isLoading[id] = false; // Set loading state to false once navigation is completed
        });
}

  
 

}
