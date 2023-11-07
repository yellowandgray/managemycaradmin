import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsComponent } from './arrivals.component';

describe('ArrivalsComponent', () => {
  let component: ArrivalsComponent;
  let fixture: ComponentFixture<ArrivalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrivalsComponent]
    });
    fixture = TestBed.createComponent(ArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
