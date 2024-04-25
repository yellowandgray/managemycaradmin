import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UservehicledetailsComponent } from './uservehicledetails.component';

describe('UservehicledetailsComponent', () => {
  let component: UservehicledetailsComponent;
  let fixture: ComponentFixture<UservehicledetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UservehicledetailsComponent]
    });
    fixture = TestBed.createComponent(UservehicledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
