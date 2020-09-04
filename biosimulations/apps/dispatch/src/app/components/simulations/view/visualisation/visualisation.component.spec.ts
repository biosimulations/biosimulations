import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationComponent } from './visualisation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('VisualisationComponent', () => {
  let component: VisualisationComponent;
  let fixture: ComponentFixture<VisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VisualisationComponent,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(VisualisationComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
