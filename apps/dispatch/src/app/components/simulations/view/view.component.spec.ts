import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { PlotlyVisualizationComponent } from './plotly-visualization/plotly-visualization.component';
import { SimulationLogModule } from './simulation-log/simulation-log.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewComponent, PlotlyVisualizationComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        IonicStorageModule.forRoot({
          driverOrder: ['indexeddb', 'websql', 'localstorage'],
        }),
        SimulationLogModule,
        NoopAnimationsModule,
      ],
      providers: [ConfigService, ScrollService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
