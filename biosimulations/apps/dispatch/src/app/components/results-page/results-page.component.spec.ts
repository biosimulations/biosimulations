import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPageComponent } from './results-page.component';
import { VisualisationContainerComponent } from '../visualisation-container/visualisation-container.component';
import { ViewVisualisationComponent } from '../view-visualisation/view-visualisation.component';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResultsPageComponent,
        VisualisationContainerComponent,
        ViewVisualisationComponent,
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(ResultsPageComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
