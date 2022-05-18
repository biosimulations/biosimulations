import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { ChartComponent } from '../chart/chart.component';
import { PaletteService } from '../palette-service/palette.service';
import { StatisticViewerComponent } from '../statistic-viewer/statistic-viewer.component';
import { SummaryPageSectionComponent } from '../summary-page-section/summary-page-section.component';
import { SummaryPageComponent } from './summary-page.component';

describe('SummaryPageComponent', () => {
  let component: SummaryPageComponent;
  let fixture: ComponentFixture<SummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiModule],
      providers: [
        {
          provide: PaletteService,
          useValue: {
            getColorPalette: (count: number) => ['#000000', '#ffffff'],
          },
        },
      ],
      declarations: [SummaryPageComponent, SummaryPageSectionComponent, ChartComponent, StatisticViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
