import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-uservehicledetails',
  templateUrl: './uservehicledetails.component.html',
  styleUrls: ['./uservehicledetails.component.scss']
})
export class UservehicledetailsComponent {
  breadCrumbItems!: Array<{}>;
  currentTab: number = 0;
  id: string='';
  firstname: string = '';
  lastname: string = '';
  allvehicle: any[] = [];
  loading: boolean = true;
  showAllMotHistory: boolean = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.firstname = params['firstname']  ;
      this.lastname = params['lastname'];
      console.log('ID:', this.id);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.fetchVehicle();
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];
  }

  async fetchVehicle() {
    try {
      const response = await this.apiService.getvehicles().toPromise();
      console.log(response);

      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        this.allvehicle = response.data.filter((vehicle: any) => vehicle.userId === this.id);
        console.log('Filtered Vehicles:', this.allvehicle);
      } else {
        this.allvehicle = [];
        console.error('Invalid data format: ', response);
      }

      console.log('All Vehicles:', this.allvehicle);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching vehicles: ', error);
      this.allvehicle = [];
      this.loading = false;
    }
  }
  toggleShowAllMotHistory() {
    this.showAllMotHistory = !this.showAllMotHistory;
  }
  changeTab(index: number) {
    this.currentTab = index;
  }
}
