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

import {  MahisRoutingModule } from './mahis-routing.module';

// import { StudentsComponent } from './students/students.component';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { EmployesComponent } from './employes/employes.component';



@NgModule({
  declarations: [


    EmployesComponent,
    // StudentsComponent,
    // OthersComponent,
    // StudentComponent,
    // DriverComponent,
    // StudentDetailsComponent,
    // DriverDetailsComponent,
    // TeacherDetailsComponent,



    // NgbdListSortableHeader,
  ],
  imports: [
    CommonModule,
    MahisRoutingModule,
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
export class MahisModule { }