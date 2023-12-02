import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.scss']
})
export class TestpageComponent {
  breadCrumbItems!: Array<{}>;
  
constructor(private router: Router){}
  navigateToAddTestPage() {
    this.router.navigate(['/kgsheet/addtestpage']);
    
  }
}
