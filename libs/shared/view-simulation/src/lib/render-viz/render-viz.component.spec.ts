import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { RenderVisualizationComponent } from './render-viz.component';
import { PlotlyVisualizationComponent } from '@biosimulations/shared/viz-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('RenderVisualizationComponent', () => {
  let component: RenderVisualizationComponent;
  let fixture: ComponentFixture<RenderVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenderVisualizationComponent, PlotlyVisualizationComponent],
      imports: [
        BiosimulationsIconsModule,
        SharedUiModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderVisualizationComponent);
    component = fixture.componentInstance;
    component.visualization = {
      _type: 'VegaVisualization',
      id: '',
      name: '',
      renderer: 'Vega',
      vegaSpec: of(false),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
