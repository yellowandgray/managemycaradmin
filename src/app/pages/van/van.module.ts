import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Page Route
import { SharedModule } from 'src/app/shared/shared.module';

// simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

// bootstrap component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

// count to
//  import { CountUpModule } from 'ngx-countup';

// Calendar package
import { FullCalendarModule } from '@fullcalendar/angular';

// Leaflet map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';



// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// chart
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AddrouteComponent } from './addroute/addroute.component';
import { AddvanComponent } from './addvan/addvan.component';
import { ArrivalsComponent } from './arrivals/arrivals.component';
import { MapComponent } from './map/map.component';
import { vanRoutingModule } from './van-routing.module';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { VanDetailsComponent } from './van-details/van-details.component';


// Component
// import { NgbdFileSortableHeader } from './file-manager/file-manager-sortable.directive';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    AddrouteComponent,
    AddvanComponent,
    ArrivalsComponent,
    MapComponent,
    RouteDetailComponent,
    VanDetailsComponent
  
    // NgbdWidgetSortableHeader,
    // NgbdFileSortableHeader
  ],
  imports: [
    CommonModule,
    vanRoutingModule,
    FullCalendarModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    SimplebarAngularModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    // CountUpModule,
    ProgressbarModule,
    NgApexchartsModule,
    PickerModule,
    TabsModule.forRoot(),
    SharedModule,
    LeafletModule,
    PaginationModule.forRoot(),
    NgxEchartsModule.forRoot({ echarts }),
    CKEditorModule,
    DropzoneModule
  ],

  providers: [
    DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  
})
export class vanModule { }
