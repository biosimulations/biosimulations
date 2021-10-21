import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { DataVisualizationComponent } from './data-visualization.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

describe('DataVisualizationComponent', () => {
  let component: DataVisualizationComponent;
  let fixture: ComponentFixture<DataVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        SharedContentModule,
        HighlightModule,
      ],
      providers: [
        RouterTestingModule,
        ConfigService,
        ScrollService,
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            fullLibraryLoader: () => import('highlight.js'),
          },
        },
      ],
      declarations: [DataVisualizationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
