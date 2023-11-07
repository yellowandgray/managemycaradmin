import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddlistComponent } from './addlist/addlist.component';
import { MapsheetComponent } from './mapsheet/mapsheet.component';
import { AddItemComponent } from './additem/additem.component';

const routes: Routes = [
  {
    path: "additems",
    component: AddItemComponent
},
{
    path: "addlist",
    component: AddlistComponent
},
{
    path: "mapsheet",
    component: MapsheetComponent
},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KgRoutingModule { }
