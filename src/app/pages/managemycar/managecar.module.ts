import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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




@NgModule({
  declarations: [
    UsersComponent,
    QueriesComponent,
    GaragesComponent,
    BookingComponent


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
  
    SimplebarAngularModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageCar { }