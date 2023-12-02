import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddlistComponent } from './addlist/addlist.component';
import { MapsheetComponent } from './mapsheet/mapsheet.component';
import { AddItemComponent } from './additem/additem.component';
import { TestpageComponent } from './testpage/testpage.component';
import { AddtestpagesComponent } from './addtestpages/addtestpages.component';

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
{
  path: "testpage",
  component: TestpageComponent
},
{
  path: "addtestpage",
  component: AddtestpagesComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KgRoutingModule { }
