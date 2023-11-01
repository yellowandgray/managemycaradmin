import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component

import { VanComponent } from './van/van.component';
import { KgSheetComponent } from './kg-sheet/kg-sheet.component';
import { AddressBookComponent } from './address-book/address-book.component';

const routes: Routes = [
    {
        path: "van",
        component: VanComponent
    },
    {
        path: "kg-sheet",
        component: KgSheetComponent
    },
    {
        path: "address-book",
        component: AddressBookComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchoolRoutingModule { }
