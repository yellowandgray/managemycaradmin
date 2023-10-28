import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Page Route
import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Count To
import { CountUpModule } from 'ngx-countup';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// bootstrap component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Component
import { ListComponent } from './list/list.component';
import { NgbdTicketListSortableHeader } from './list/list-sortable.directive';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    ListComponent,
    NgbdTicketListSortableHeader,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    SharedModule,
    CountUpModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    TooltipModule
  ]
})
export class TicketsModule { }
