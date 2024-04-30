import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent {
  id: string='';

  loading: boolean = true;
  usersdatas: any;
  usersdata: any;
  constructor(private http: HttpClient, private route: ActivatedRoute,private apiService: ApiService,private location: Location ) {
    const idgareage = this.route.snapshot.paramMap.get('id');
    this.id = idgareage ? idgareage : '';
    
    console.log(this.id);

  }

  async ngOnInit() {

    this.apiService.getusersData().subscribe(actions => {
      this.usersdatas = actions.map(action => action.payload.doc.data());
      this.usersdata = this.usersdatas.find((user: any) => user.id === this.id);
      this.loading = false;
    });
    // try {
    //   const response = await this.apiService.getUsers().toPromise();
    //   console.log(response);
    //   if (response && response.status === 'Success' && Array.isArray(response.data)) {
    //     this.usersdatas = response.data; 
    //     this.usersdata = this.usersdatas.find((user: any) => user.id === this.id);
        
    //   } else {
    //     this.usersdata = null; // Setting to null if no match found
    //     console.error('Invalid data format: ', response);
    //   }
    //   console.log(this.usersdata);
    //   this.loading = false;
    // } catch (error) {
    //   console.error('Error fetching users: ', error);
    //   this.usersdata = null; // Setting to null in case of error
    //   this.loading = false;
    // }
  }
  
  
  goBack() {
    this.location.back();
  }
 
}
