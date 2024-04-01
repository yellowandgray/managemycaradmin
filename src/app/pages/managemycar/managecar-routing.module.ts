import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { QueriesComponent } from './queries/queries.component';
import { GaragesComponent } from './garages/garages.component';
import { BookingComponent } from './booking/booking.component';


// Component



const routes: Routes = [
    {
        path: "user",
        component: UsersComponent
    },
    
    {
        path: "queries",
        component: QueriesComponent
    },
    {
        path: "garage",
        component: GaragesComponent
    },
    {
        path: "",
        component: BookingComponent
    },

   
    
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCarRoutingModule { }
