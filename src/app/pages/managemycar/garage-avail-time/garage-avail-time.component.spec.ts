import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GareageAvailTimeComponent } from './garage-avail-time.component';

describe('GareageAvailTimeComponent', () => {
  let component: GareageAvailTimeComponent;
  let fixture: ComponentFixture<GareageAvailTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GareageAvailTimeComponent]
    });
    fixture = TestBed.createComponent(GareageAvailTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
