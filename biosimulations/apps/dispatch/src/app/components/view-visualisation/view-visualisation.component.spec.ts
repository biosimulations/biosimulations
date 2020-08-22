import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisualisationComponent } from './view-visualisation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewVisualisationComponent', () => {
  let component: ViewVisualisationComponent;
  let fixture: ComponentFixture<ViewVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewVisualisationComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
