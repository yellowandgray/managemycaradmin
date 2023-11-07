import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlistComponent } from './addlist.component';

describe('AddlistComponent', () => {
  let component: AddlistComponent;
  let fixture: ComponentFixture<AddlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddlistComponent]
    });
    fixture = TestBed.createComponent(AddlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
