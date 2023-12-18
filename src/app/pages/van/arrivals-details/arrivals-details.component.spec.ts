import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsDetailsComponent } from './arrivals-details.component';

describe('arrivalsDetailsComponent', () => {
  let component: ArrivalsDetailsComponent;
  let fixture: ComponentFixture<ArrivalsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrivalsDetailsComponent]
    });
    fixture = TestBed.createComponent(ArrivalsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
