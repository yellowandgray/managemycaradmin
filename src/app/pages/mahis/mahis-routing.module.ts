import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployesComponent } from './employes/employes.component';
import { DashboardComponent } from './dashboard/dashboard.component';


// Component



const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
        path: "employes",
        component: EmployesComponent
    },

   
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MahisRoutingModule { }
