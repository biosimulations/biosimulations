import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateComponent } from './simulate.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertComponent } from 'src/app/Components/alert/alert.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserStack } from 'protractor/built/driverProviders';
// TODO Mock the alert component
describe('SimulateComponent', () => {
  let component: SimulateComponent;
  let fixture: ComponentFixture<SimulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimulateComponent, AlertComponent],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
