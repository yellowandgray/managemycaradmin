import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMarkDetailComponent } from './student-mark-detail.component';

describe('StudentMarkDetailComponent', () => {
  let component: StudentMarkDetailComponent;
  let fixture: ComponentFixture<StudentMarkDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentMarkDetailComponent]
    });
    fixture = TestBed.createComponent(StudentMarkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
