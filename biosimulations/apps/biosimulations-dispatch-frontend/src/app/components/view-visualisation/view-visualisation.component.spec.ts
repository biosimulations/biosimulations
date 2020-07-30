import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisualisationComponent } from './view-visualisation.component';

describe('ViewVisualisationComponent', () => {
  let component: ViewVisualisationComponent;
  let fixture: ComponentFixture<ViewVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVisualisationComponent ]
    })
    .compileComponents();
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
