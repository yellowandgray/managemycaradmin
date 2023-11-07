import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvanComponent } from './addvan.component';

describe('AddvanComponent', () => {
  let component: AddvanComponent;
  let fixture: ComponentFixture<AddvanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddvanComponent]
    });
    fixture = TestBed.createComponent(AddvanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
