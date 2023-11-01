import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgSheetComponent } from './kg-sheet.component';

describe('KgSheetComponent', () => {
  let component: KgSheetComponent;
  let fixture: ComponentFixture<KgSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KgSheetComponent]
    });
    fixture = TestBed.createComponent(KgSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
