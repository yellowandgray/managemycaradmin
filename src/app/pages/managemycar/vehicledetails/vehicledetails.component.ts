import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
@Component({
  selector: 'app-vehicledetails',
  templateUrl: './vehicledetails.component.html',
  styleUrls: ['./vehicledetails.component.scss']
})
export class VehicledetailsComponent {
  id: string='';
  loading: boolean = true;
  usersdatas: any;
  usersdata: any;
  showAllMotHistory: boolean = false;
  constructor(private http: HttpClient, private route: ActivatedRoute,private apiService: ApiService,private location: Location) {
    const idgareage = this.route.snapshot.paramMap.get('id');
    this.id = idgareage ? idgareage : '';
    console.log(this.id);
    

  }

  async ngOnInit() {
    try {
      const response = await this.apiService.getvehicles().toPromise();
      console.log(response);
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.usersdatas = response.data; 
        this.usersdata = this.usersdatas.find((user: any) => user.vehicleid === this.id);
        
      } else {
        this.usersdata = null; // Setting to null if no match found
        console.error('Invalid data format: ', response);
      }
      console.log(this.usersdata);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching users: ', error);
      this.usersdata = null; // Setting to null in case of error
      this.loading = false;
    }
  }
  toggleShowAllMotHistory() {
    this.showAllMotHistory = !this.showAllMotHistory;
  }
  goBack() {
    this.location.back();
  }
}
