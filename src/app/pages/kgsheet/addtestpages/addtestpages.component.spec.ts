import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtestpagesComponent } from './addtestpages.component';

describe('AddtestpagesComponent', () => {
  let component: AddtestpagesComponent;
  let fixture: ComponentFixture<AddtestpagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtestpagesComponent]
    });
    fixture = TestBed.createComponent(AddtestpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
