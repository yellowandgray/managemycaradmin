import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignMarkComponent } from './assign-mark/assign-mark.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { StudentMarkDetailComponent } from './student-mark-detail/student-mark-detail.component';


const routes: Routes = [
    {
        path: "assign-mark",
        component: AssignMarkComponent
    },
    {
        path: "create-test",
        component: CreateTestComponent
    },
    {
        path: "student-mark",
        component: StudentMarkDetailComponent
    },
   
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestRoutesModule { }
