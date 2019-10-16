import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSimulationComponent } from './new-simulation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatDialogModule } from '@angular/material';
// TODO change this import to simply import the app-material module?
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from 'src/app/Components/alert/alert.component';
// TODO The alert component needs to be mocked !
describe('NewSimulationComponent', () => {
  let component: NewSimulationComponent;
  let fixture: ComponentFixture<NewSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewSimulationComponent],
      imports: [
        MatTableModule,
        HttpClientModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [HttpClientModule, MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
