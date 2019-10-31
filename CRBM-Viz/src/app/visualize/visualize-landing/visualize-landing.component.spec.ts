import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeLandingComponent } from './visualize-landing.component';

describe('VisualizeLandingComponent', () => {
  let component: VisualizeLandingComponent;
  let fixture: ComponentFixture<VisualizeLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizeLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
