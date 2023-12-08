import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  StudentComponent } from './student/student.component';
import { OthersComponent } from './others/others.component';
import { TeacherComponent } from './teacher/teacher.component';
// import { StudentsComponent } from './students/students.component';
import { DriverComponent } from './driver/driver.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

// Component



const routes: Routes = [
    {
        path: "teacher",
        component: TeacherComponent
    },
    // {
    //     path: "students",
    //     component: StudentsComponent
    // },
    {
        path: "others",
        component: OthersComponent
    },
    {
        path: "student",
        component: StudentComponent
    },
    {
        path: "driver",
        component: DriverComponent
    },
    {
        path: "studentdetails",
        component: StudentDetailsComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule { }
