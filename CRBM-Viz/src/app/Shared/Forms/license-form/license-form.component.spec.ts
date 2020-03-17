import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseFormComponent } from './license-form.component';

describe('LicenseFormComponent', () => {
  let component: LicenseFormComponent;
  let fixture: ComponentFixture<LicenseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
