import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSimulationComponent } from './past-simulation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatDialogModule } from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from 'src/app/Components/alert/alert.component';
// TODO The alert component needs to be mocked!

// TODO this test causes the next test to fail due to missing alertcomponent factory
xdescribe('PastSimulationComponent', () => {
  let component: PastSimulationComponent;
  let fixture: ComponentFixture<PastSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastSimulationComponent, AlertComponent],
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
    fixture = TestBed.createComponent(PastSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
