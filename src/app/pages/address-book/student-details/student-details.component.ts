import { Component } from '@angular/core';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent {
  breadCrumbItems!: Array<{}>;
  currentTab:any = "Home"

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Tabs', active: true }];
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }
}
