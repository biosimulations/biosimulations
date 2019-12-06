import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaViewerComponent } from './vega-viewer.component';
import { Visualization } from 'src/app/Shared/Models/visualization';

describe('VegaViewerComponent', () => {
  let component: VegaViewerComponent;
  let fixture: ComponentFixture<VegaViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaViewerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaViewerComponent);
    component = fixture.componentInstance;
    const mockviz: Visualization = new Visualization();
    mockviz.id = 0;
    mockviz.name = 'testViz';
    mockviz.spec = 'https://vega.github.io/vega/examples/bar-chart.vg.json';
    component.spec = mockviz.spec;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
