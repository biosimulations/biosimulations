import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationContainerComponent } from './visualisation-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('VisualisationContainerComponent', () => {
  let component: VisualisationContainerComponent;
  let fixture: ComponentFixture<VisualisationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VisualisationContainerComponent,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(VisualisationContainerComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
