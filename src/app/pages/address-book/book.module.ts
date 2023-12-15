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

import { BookRoutingModule } from './book-routing.module';
import { DriverComponent } from './driver/driver.component';
import { OthersComponent } from './others/others.component';
// import { StudentsComponent } from './students/students.component';
import { TeacherComponent } from './teacher/teacher.component';
// import { NgbdListSortableHeader } from './students/student-short';
import { StudentComponent } from './student/student.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DriverDetailsComponent } from './driver-details/driver-details.component';


@NgModule({
  declarations: [
    TeacherComponent,
    // StudentsComponent,
    OthersComponent,
    StudentComponent,
    DriverComponent,
    StudentDetailsComponent,
    DriverDetailsComponent,


    // NgbdListSortableHeader,
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
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
export class BookModule { }