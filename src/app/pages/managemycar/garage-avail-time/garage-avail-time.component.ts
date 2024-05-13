import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  allTimeSlotsSelected: boolean = false;
  id: string = '';
  date: string = '';
  timeSlots: { startTime: string; endTime: string; active: boolean }[] = [];
  isToggled: boolean = false;

  services: { id: string; name: string; des: string; include: string, cost: number }[] = [];


  times: { day: string; startTime: string; endTime: string }[] = [];
  timeslotcheck:boolean = false;

  dataSubscription: Subscription | null = null;
  gettimes: { [day: string]: { startTime: string, endTime: string }[] } = {};
  timeSlot: { startTime: string, endTime: string }[] = [];
  startTime: string = '';
  endTime: string = '';
  day: [] = [];
 
  selectedSecond: string | undefined;
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  selectedDay: string = '';
  selectedTab: number = 1;
  loadingIndex: number = -1;
  changeTab(tab: string) {
    this.currentTab = tab;
  }
  selectedTimeSlots: { date: string, startTime: string, endTime: string, selected: boolean }[] = [];




  constructor(private http: HttpClient, private route: ActivatedRoute, private apiService: ApiService, private location: Location) {
    this.date = new Date().toISOString().split('T')[0];
    this.updateSelectedDay();
    this.addNewServiceRow();
    this.addNewRow("Monday-Friday"); 
    this.addNewRow("Saturday");  
    this.addNewRow("Sunday");
  }

  async ngOnInit(): Promise<void> {
  
    this.route.paramMap.subscribe(params => {
        const garageData = history.state.garageData;
        console.log(garageData, 'garages');
        this.id = garageData.id;
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

    try {
        const response = await this.apiService.getGaragesid(this.id).toPromise();
        console.log(response, 'this.id');
        if (response.status === 'Success' && response.data && response.data.services && response.data.services.length > 0) {
            this.services = response.data.services.map((service: any) => ({
                id: service.id || '',
                name: service.name || '',
                des: service.desc || '',
                include: service.include || '',
                cost: service.cost || 0
            }));
        } 
        if (response.status === 'Success' && response.data && response.data.timeslots && response.data.timeslots.length > 0) {
            this.times = response.data.timeslots.map((timeslot: any) => ({
                day: timeslot.day || '',
                startTime: timeslot.startTime || '',
                endTime: timeslot.endTime || ''
            }));
            this.timeslotcheck=true;
        }
    } catch (error) {
        console.error('Error fetching garage data:', error);
    }

    this.getTimeslots();
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];

    // Call updateSelectedDay to fetch appointments for the current date

  //  this.updateSelectedDay();
}


isStartTimeEndTimeEmpty(): boolean {
  return this.times.some(time => !time.startTime || !time.endTime);
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
       

        }
      );

    this.apiService.getGarages();
  }












  deleteTimeSlot(index: number) {
    this.times.splice(index, 1);
  }

  addNewServiceRow() {
    console.log(this.services);
    this.services.push({ id: '', name: '', des: '', include: '', cost: 0 });
  }

  addNewRow(defaultDay: string) {
    this.times.push({ day: defaultDay, startTime: '', endTime: '' });
}






  saveTimeService() {
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
    }, 2000);
    console.log(this.id,'id check')
    const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/createTimeslot/${this.id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer api-token-1'
      })
    };
    this.apiService.getGarages();
    const body = {
      timeslot: this.times.map(service => ({
        day: service.day,
        startTime: service.startTime,
        endTime: service.endTime
      }))
    };
    this.apiService.getGarages();
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
      this.ngOnInit();
 
      // this.apiService.getGarages();
  }


  updateTimeService(data: any) {
    console.log(data,'check data')
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
    }, 2000);
  

    this.times.forEach(service => {
      const url = `https://us-central1-fluted-reason-415816.cloudfunctions.net/app/api/updateTimeslot/${this.id}/${service.day}`;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer api-token-1'
        })
      };
  
      const body = {
        startTime: service.startTime,
        endTime: service.endTime
      };
  
      console.log('Request body:', body);
  
      this.http.put(url, body, httpOptions)
        .subscribe(
          (response) => {
            console.log(`Timeslot for ${service.day} updated successfully:`, response);
            // Handle success response here if needed
          },
          (error) => {
            console.error(`Error occurred while updating timeslot for ${service.day}:`, error);
            // Handle error appropriately
          }
        );
        this.ngOnInit();
    });
    
  }
  
  
  
  

  removeRow(index: number) {
    this.timeSlots.splice(index, 1);
  }



  addTimeSlot() {
    const availabilityData = {
      date: this.date,
      timeslots: this.timeSlots,
    };
    // console.log(this.date);
    // console.log(this.timeSlots);
    // console.log(availabilityData);
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
          // this.times =this.gettimes;
          console.log('Time slots fetched successfully:', this.gettimes);
          this.updateSelectedDay();
        },
        (error) => {
          console.error('Error occurred while fetching time slots:', error);
        }
      );
  }


  openDatePicker() {
    const today = new Date().toISOString().split('T')[0];
    this.date = today;
    this.updateSelectedDay(); // Update the selected day based on the new date
    // setTimeout(() => {
    //   if (this.dateInputRef) {
    //     this.dateInputRef.nativeElement.click();
    //   }
    // }, 0);
  }


  filterTimeSlots() {
    // Check if the selected day is one of the weekdays (Monday to Friday)
    console.log(this.selectedDay,'this.selectedDay')
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
        console.log('Selected time slot' , this.timeSlot);
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

  
  

  selectTimeSlot(slot: { startTime: string, endTime: string }) {
    const date = this.date; 
    const index = this.selectedTimeSlots.findIndex(selectedSlot =>
      selectedSlot.date === date && selectedSlot.startTime === slot.startTime && selectedSlot.endTime === slot.endTime
    );
    if (index === -1) {
      this.selectedTimeSlots.push({ date, ...slot, selected: true });
    } else {
      this.selectedTimeSlots[index].selected = !this.selectedTimeSlots[index].selected;
    }
}
  
isSelected(slot: { startTime: string, endTime: string }): boolean {
  return this.selectedTimeSlots.some(selectedSlot =>
    selectedSlot.startTime === slot.startTime && selectedSlot.endTime === slot.endTime && selectedSlot.selected
  );
}
selectAllTimeSlots() {
  if (this.allTimeSlotsSelected) {
    // If all time slots are currently selected, unselect all
    this.selectedTimeSlots = [];
  } else {
    // If not all time slots are selected, select all
    this.timeSlot.forEach(slot => {
      const isSelected = this.isSelected(slot);
      if (!isSelected) {
        const date = this.date;
        this.selectedTimeSlots.push({ date, ...slot, selected: true });
      }
    });
  }
  // Toggle the flag
  this.allTimeSlotsSelected = !this.allTimeSlotsSelected;
}
  appointments() {
    this.submitted = true;
    setTimeout(() => {
        this.submitted = false;
    }, 2000);
    const garageId = this.id; // Get the garage ID
  
    const timeSlotMap: { [key: string]: boolean } = {};
  
    this.selectedTimeSlots.forEach(slot => {
        const { startTime, endTime, selected } = slot;
        const formattedSlot = this.formatTimeSlot(startTime, endTime);
  
        if (selected) {
            // Add the selected time slot to the map
            timeSlotMap[formattedSlot] = selected;
        }
    });
  
    const formattedDate = this.formatDate(this.selectedTimeSlots[0].date); // Assuming all selected slots have the same date
  
    const sortedTimeSlotMap = this.sortTimeSlots(timeSlotMap);
  
    console.log("final time slot",sortedTimeSlotMap);
    const appointmentData = {
        date: formattedDate,
        timeslot: sortedTimeSlotMap // Use the sorted map of time slots
    };
  
    this.apiService.createAppointment(garageId, appointmentData)
        .then(() => {
            console.log('Appointment created for', formattedDate);
        })
        .catch(error => {
            console.error('Error creating appointment:', error);
        });
    this.apiService.getGarages();
}


sortTimeSlots(timeSlotMap: { [key: string]: boolean }): { [key: string]: boolean } {
  const sortedTimeSlotMap: { [key: string]: boolean } = {}; // Type annotation provided here

  const slots = Object.keys(timeSlotMap);

  // Sort slots based on start time, but reverse the order
  const sortedSlots = slots.sort((a, b) => {
    const startTimeA = this.getStartTime(a);
    const startTimeB = this.getStartTime(b);
    // Reverse the comparison to sort PM slots before AM slots
    return startTimeB - startTimeA;
  });

  // Convert sorted slots back to a map
  sortedSlots.forEach(key => {
    sortedTimeSlotMap[key] = timeSlotMap[key];
  });
  console.log(sortedTimeSlotMap,'sortedTimeSlotMap')
  return sortedTimeSlotMap;
}




getStartTime(slot: string): number {
  const parts = slot.split('-')[0].split(':');
  const hour = parseInt(parts[0]);
  const minute = parseInt(parts[1].substring(0, 2)); // Remove 'am' or 'pm'
  const amOrPm = parts[1].substring(2); // Get 'am' or 'pm'

  let startTime = hour * 60 + minute;

  // Adjust for PM hours
  if (amOrPm === 'pm' && hour !== 12) {
    startTime += 12 * 60; // Add 12 hours if it's PM
  }

  return startTime;
}



compareStartTime(slotA: string, slotB: string): number {
  const startTimeA = this.getStartTime(slotA);
  const startTimeB = this.getStartTime(slotB);
  return startTimeA - startTimeB;
}





  formatTimeSlot(startTime: string, endTime: string): string {
    // Format the time slot according to your specified format
    return `${startTime}-${endTime}`;
  }
  
  
  formatDate(date: string): string {
    // Assuming date format is "YYYY-MM-DD"
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Format as "DD-MM-YYYY"
  }
  
  


 

  updateSelectedDay() {
    console.log('updateSelectedDay called')
    const selectedDate = new Date(this.date);
    const selectedDayIndex = selectedDate.getDay();
    this.selectedDay = this.days[selectedDayIndex];
    // Call filter method after updating the selected day
    this.filterTimeSlots();
}


  goBack() {
    this.location.back();
  }


  

}


// getStartTime(timeSlot: string): number {
//   // Extract start time
//   const startTime = timeSlot.split('-')[0].trim();

//   // Extract hours and minutes
//   const [time, period] = startTime.split(' ');
//   const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));

//   // Convert start time value to minutes since midnight
//   let totalTime = hours * 60 + minutes;
//   if (period === 'PM' && hours !== 12) {
//       totalTime += 12 * 60; // Add 12 hours for PM times except 12:00 PM
//   } else if (period === 'AM' && hours === 12) {
//       totalTime -= 12 * 60; // Subtract 12 hours for 12:00 AM
//   }
//   return totalTime;
// }


// sortTimeSlots(timeSlotMap: { [key: string]: boolean }): { [key: string]: boolean } {
//   const sortedTimeSlotMap: { [key: string]: boolean } = {};

//   const slots = Object.keys(timeSlotMap);

//   // Sort slots based on start time
//   const sortedSlots = slots.sort((a, b) => {
//     const startTimeA = this.getStartTime(a);
//     const startTimeB = this.getStartTime(b);
//     return startTimeA - startTimeB;
//   });

//   // Convert sorted slots back to a map
//   sortedSlots.forEach(key => {
//     sortedTimeSlotMap[key] = timeSlotMap[key];
//   });
// console.log(sortedTimeSlotMap,'sortedTimeSlotMap')
//   return sortedTimeSlotMap;
// }