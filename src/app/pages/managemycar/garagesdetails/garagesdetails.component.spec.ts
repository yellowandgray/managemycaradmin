import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaragesdetailsComponent } from './garagesdetails.component';

describe('GaragesdetailsComponent', () => {
  let component: GaragesdetailsComponent;
  let fixture: ComponentFixture<GaragesdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GaragesdetailsComponent]
    });
    fixture = TestBed.createComponent(GaragesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
