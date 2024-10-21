import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from '../chart/chart.component';
//import { PaletteService } from '../palette-service/palette.service';
import { StatisticViewerComponent } from '../statistic-viewer/statistic-viewer.component';
import { SummaryPageSectionComponent } from '../summary-page-section/summary-page-section.component';
import { SummaryPageSubsectionComponent } from '../summary-page-subsection/summary-page-subsection.component';
import { SummaryPageComponent } from './summary-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe('SummaryPageComponent', () => {
  let component: SummaryPageComponent;
  let fixture: ComponentFixture<SummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, FlexModule, NgChartsModule, BiosimulationsIconsModule, HttpClientTestingModule],
      providers: [
        {
          provide: 'PaletteService',
          useValue: {
            getColorPalette: (_count: number): string[] => ['#000000', '#ffffff'],
          },
        },
      ],
      declarations: [
        SummaryPageComponent,
        SummaryPageSectionComponent,
        ChartComponent,
        StatisticViewerComponent,
        SummaryPageSubsectionComponent,
      ],
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
