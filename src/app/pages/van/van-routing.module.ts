import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map/map.component';
import { AddrouteComponent } from './addroute/addroute.component';
import { AddvanComponent } from './addvan/addvan.component';
import { ArrivalsComponent } from './arrivals/arrivals.component';

// Component



const routes: Routes = [
    {
        path: "addroute",
        component: AddrouteComponent
    },
    {
        path: "addvan",
        component: AddvanComponent
    },
    {
        path: "arrivals",
        component: ArrivalsComponent
    },
    {
        path: "map",
        component: MapComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class vanRoutingModule { }
