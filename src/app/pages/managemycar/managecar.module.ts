import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// module

import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';
// component


// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// Sorting page

import {  ManageCarRoutingModule } from './managecar-routing.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { UsersComponent } from './users/users.component';
import { QueriesComponent } from './queries/queries.component';
import { GaragesComponent } from './garages/garages.component';
import { BookingComponent } from './booking/booking.component';
import { GareageAvailTimeComponent } from './garage-avail-time/garage-avail-time.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'; 

import { MatNativeDateModule } from '@angular/material/core';
import { WelcomeBannerComponent } from './welcome-banner/welcome-banner.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { VehicledetailsComponent } from './vehicledetails/vehicledetails.component';
import { GaragesdetailsComponent } from './garagesdetails/garagesdetails.component';
import { UservehicledetailsComponent } from './uservehicledetails/uservehicledetails.component';



@NgModule({
  declarations: [
    UsersComponent,
    QueriesComponent,
    GaragesComponent,
    BookingComponent,
    GareageAvailTimeComponent,
    WelcomeBannerComponent,
    UserdetailsComponent,
    VehicledetailsComponent,
    GaragesdetailsComponent,
    UservehicledetailsComponent,
   


    // NgbdListSortableHeader,
  ],
  imports: [
    CommonModule,
    ManageCarRoutingModule,
    SharedModule,
    PaginationModule.forRoot(),
    NgPipesModule,
    BsDatepickerModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
   NgxMaterialTimepickerModule,
    SimplebarAngularModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [
    DatePipe // Add DatePipe to the providers array if you need to use it globally
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageCar { }