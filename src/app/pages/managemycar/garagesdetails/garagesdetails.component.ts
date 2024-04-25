import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-garagesdetails',
  templateUrl: './garagesdetails.component.html',
  styleUrls: ['./garagesdetails.component.scss']
})
export class GaragesdetailsComponent {
  id: string='';
  loading: boolean = true;
  usersdatas: any;
  usersdata: any;
  constructor( private route: ActivatedRoute,private apiService: ApiService,private location: Location) {
    const idgareage = this.route.snapshot.paramMap.get('id');
    this.id = idgareage ? idgareage : '';
    console.log(this.id);

  }

  async ngOnInit() {
    try {
      const response = await this.apiService.getGarages().toPromise();
      console.log(response);
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.usersdatas = response.data; 
        this.usersdata = this.usersdatas.find((user: any) => user.id === this.id);
        console.error('Invalid data format: ',   this.usersdata); 
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
  goBack() {
    this.location.back();
  }  


}
