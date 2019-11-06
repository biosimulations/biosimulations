import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSimulationComponent } from './new-simulation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// TODO The alert component needs to be mocked !
import { AlertComponent } from 'src/app/Shared/Components/alert/alert.component';
import { MaterialModule } from 'src/app/Modules/app-material.module';

// TODO this test causes the next test to fail due to missing alertcomponent factory
xdescribe('NewSimulationComponent', () => {
  let component: NewSimulationComponent;
  let fixture: ComponentFixture<NewSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewSimulationComponent],
      imports: [
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [HttpClientModule, MaterialModule, MatDialogModule],
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
