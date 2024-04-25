import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { QueriesComponent } from './queries/queries.component';
import { GaragesComponent } from './garages/garages.component';
import { BookingComponent } from './booking/booking.component';

import { GareageAvailTimeComponent } from './garage-avail-time/garage-avail-time.component';
import { WelcomeBannerComponent } from './welcome-banner/welcome-banner.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { VehicledetailsComponent } from './vehicledetails/vehicledetails.component';
import { GaragesdetailsComponent } from './garagesdetails/garagesdetails.component';
import { UservehicledetailsComponent } from './uservehicledetails/uservehicledetails.component';


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
    { 
        path: 'gareageavail', 
        component: GareageAvailTimeComponent 
    },
    {
        path: "Welcome",
        component: WelcomeBannerComponent
    },
    {
        path: "userdetails/:id",
        component: UserdetailsComponent
    },
    {
        path: "vehicaledetails/:id",
        component:VehicledetailsComponent 
    },
    {
        path: "garagesdetails/:id",
        component:GaragesdetailsComponent 
    },
    {
        path: "uservehicledetails",
        component:UservehicledetailsComponent 
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCarRoutingModule { }
