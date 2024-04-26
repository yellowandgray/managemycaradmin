import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-garage-avail-time',
  templateUrl: './garage-avail-time.component.html',
  styleUrls: ['./garage-avail-time.component.scss']
})


export class GareageAvailTimeComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  submitted: boolean = false;
  loading: boolean = true;
  currentTab: any = "developers"

  id: string = '';
  date: string = '';
  timeSlots: { startTime: string; endTime: string; active: boolean }[] = [];
  isToggled: boolean = false;

  services: { id: string; name: string; des: string; include: string, cost: number }[] = [];


  times: { day: string; startTime: string; endTime: string }[] = [];
  monfri: string = 'Monday-Friday';
  sat: string = 'Saturday';
  sun: string = 'Sunday';
  dataSubscription: Subscription | null = null;
  gettimes: { [day: string]: { startTime: string, endTime: string }[] } = {};
  timeSlot: { startTime: string, endTime: string }[] = [];
  startTime: string = '';
  endTime: string = '';
  startTime1: string = '';
  endTime1: string = '';
  startTime2: string = '';
  endTime2: string = '';
  selectedSecond: string | undefined;
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  selectedDay: string = '';
  selectedTab: number = 1;

  changeTab(tab: string) {
    this.currentTab = tab;
  }



  constructor(private http: HttpClient, private route: ActivatedRoute, private apiService: ApiService, private location: Location) {
    this.getTimeslots();
    this.addNewServiceRow()
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const garageData = history.state.garageData;
      console.log(garageData, 'garages');
      this.id = garageData.id
      if (garageData && garageData.services && garageData.services.length > 0) {
        this.services = garageData.services.map((service: any) => ({
          id: service.id || '',
          name: service.name || '',
          des: service.desc || '',
          include: service.include || '',
          cost: service.cost || 0
        }));

      }
    });
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];
  }


  toggleValue() {
    this.isToggled = !this.isToggled;
    console.log('Toggled value:', this.isToggled);
  }


  // services

  saveService() {
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
    }, 2000);
    console.log(this.id)
    const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createService/${this.id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1'
      })
    };
    const body = {
      services: this.services.map(service => ({
        id: service.id,
        name: service.name,
        cost: service.cost,
        desc: service.des,
        include: service.include
      }))
    };

    console.log('Request body:', body);

    this.http.post(url, body, httpOptions)
      .subscribe(
        (response) => {
          console.log('Service saved successfully:', response);
        },
        (error) => {
          console.error('Error occurred while saving service:', error);
        }
      );
    this.loading = false;
    this.apiService.getGarages();
  }

  delet(serviceId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1',

      })
    };

    this.http.delete(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/deleteService/${this.id}/services/${serviceId}`, httpOptions)
      .subscribe(
        () => {
          console.log('Document deleted successfully');
          // this.ngOnInit()
          this.apiService.getGarages();
          const index = this.services.findIndex(service => service.id === serviceId);
          if (index !== -1) {
            this.services.splice(index, 1);
            this.apiService.getGarages();
          }
        },
        (error) => {
          console.error('Error deleting document:', error);
          const index = this.services.findIndex(service => service.id === serviceId);
          if (index !== -1) {
            this.services.splice(index, 1);
            this.apiService.getGarages();
          }
          // this.ngOnInit()

        }
      );
    // this.ngOnInit()
    this.apiService.getGarages();
  }












  deleteTimeSlot(index: number) {
    this.times.splice(index, 1);
  }

  addNewServiceRow() {
    console.log(this.services);
    this.services.push({ id: '', name: '', des: '', include: '', cost: 0 });
  }








  saveTimeService() {
    const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createTimeslot/${this.id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1'
      })
    };

    const body = {
      timeslot: this.times.map(service => ({
        day: service.day,
        startTime: service.startTime,
        endTime: service.endTime
      }))
    };

    console.log('Request body:', body);

    this.http.post(url, body, httpOptions)
      .subscribe(
        (response) => {
          console.log('Service saved successfully:', response);
          // Handle success response here if needed
        },
        (error) => {
          console.error('Error occurred while saving service:', error);
          // Handle error appropriately
        }
      );
  }



  removeRow(index: number) {
    this.timeSlots.splice(index, 1);
  }



  addTimeSlot() {
    const availabilityData = {
      date: this.date,
      timeslots: this.timeSlots,
    };
    console.log(this.date);
    console.log(this.timeSlots);
    console.log(availabilityData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1',
        'Content-Type': 'application/json'
      })
    };

    this.http.post(`https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createAppointments/${this.id}`, availabilityData, httpOptions)
      .subscribe(
        (response) => {
          console.log('Success:', response);
        },
        (error) => {
          console.error('Error:', error);

        }
      );
  }



  getTimeslots() {
    const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/getTimeslots/${this.id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1'
      })
    };

    this.dataSubscription = this.http.get<any>(url, httpOptions)
      .subscribe(
        (response) => {
          this.gettimes = response.timeslots;
          console.log('Time slots fetched successfully:', this.gettimes);
          // Initial filter call after fetching data
          // this.filterTimeSlots();
        },
        (error) => {
          console.error('Error occurred while fetching time slots:', error);
        }
      );
  }
  filterTimeSlots() {
    // Check if the selected day is one of the weekdays (Monday to Friday)
    if (this.days.slice(1, 6).includes(this.selectedDay)) {
      console.log('Selected day:', this.selectedDay);
      const mondayToFridayTimeSlots = this.gettimes['Monday-Friday'] || [];

      if (mondayToFridayTimeSlots.length > 0) {
        const startTime = mondayToFridayTimeSlots[0].startTime;
        const endTime = mondayToFridayTimeSlots[0].endTime;

        const startDate = new Date(`${this.date} ${startTime}`);
        const endDate = new Date(`${this.date} ${endTime}`);

        this.timeSlot = [];

        // Generate time slots for Monday to Friday
        for (let time = startDate; time < endDate; time.setHours(time.getHours() + 1)) {
          const formattedStartTime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          const formattedEndTime = new Date(time.getTime() + (60 * 60 * 1000)).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          this.timeSlot.push({ startTime: formattedStartTime, endTime: formattedEndTime });
        }

        // Update the start and end time based on Monday to Friday
        this.startTime = startTime;
        this.endTime = endTime;
      } else {
        // If no time slots are available for Monday to Friday, clear the time slots
        this.timeSlot = [];
        this.startTime = '';
        this.endTime = '';
      }
    } else {
      console.log('Selected day is not Monday-Friday');
      const selectedDayTimeSlots = this.gettimes[this.selectedDay] || [];

      if (selectedDayTimeSlots.length > 0) {
        const startTime = selectedDayTimeSlots[0].startTime;
        const endTime = selectedDayTimeSlots[0].endTime;

        const startDate = new Date(`${this.date} ${startTime}`);
        const endDate = new Date(`${this.date} ${endTime}`);

        this.timeSlot = [];

        for (let time = startDate; time < endDate; time.setHours(time.getHours() + 1)) {
          const formattedStartTime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          const formattedEndTime = new Date(time.getTime() + (60 * 60 * 1000)).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          this.timeSlot.push({ startTime: formattedStartTime, endTime: formattedEndTime });
        }

        // Update the start and end time based on the selected day
        this.startTime = startTime;
        this.endTime = endTime;
      } else {
        // If no time slots are available for the selected day, clear the time slots
        this.timeSlot = [];
        this.startTime = '';
        this.endTime = '';
      }
    }
  }



  updateSelectedDay() {
    const selectedDate = new Date(this.date);
    const selectedDayIndex = selectedDate.getDay();
    this.selectedDay = this.days[selectedDayIndex];
    console.log('Selected day:', this.selectedDay); // Add this line for debugging
    // Call filter method after updating the selected day
    this.filterTimeSlots();
  }

  goBack() {
    this.location.back();
  }

}




