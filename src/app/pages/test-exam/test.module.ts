import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// chart
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgModule } from '@angular/core';
import { TestRoutesModule } from './test-routing.module';
import { AssignMarkComponent } from './assign-mark/assign-mark.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { SharedModule } from "../../shared/shared.module";








const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
 
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
    declarations: [
        AssignMarkComponent,
        CreateTestComponent
        // NgbdWidgetSortableHeader,
        // NgbdFileSortableHeader
    ],
    providers: [
        DatePipe,
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }
    ],
    imports: [
        CommonModule,
        TestRoutesModule,
        FullCalendarModule,
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        SimplebarAngularModule,
        NgxEchartsModule.forRoot({ echarts }),
        CKEditorModule,
        DropzoneModule,
        SharedModule
    ]
})
export class TestModule { }