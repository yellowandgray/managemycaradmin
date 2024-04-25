import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


// page route
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    
  
   
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe // Add DatePipe to the providers array if you need to use it globally
  ],
})
export class PagesModule { }
