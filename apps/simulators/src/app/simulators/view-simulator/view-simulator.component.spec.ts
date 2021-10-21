import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimulatorComponent } from './view-simulator.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

describe('ViewSimulatorComponent', () => {
  let component: ViewSimulatorComponent;
  let fixture: ComponentFixture<ViewSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedUiModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BiosimulationsIconsModule,
        MatTabsModule,
        NoopAnimationsModule,
        HighlightModule,
      ],
      declarations: [ViewSimulatorComponent],
      providers: [
        ConfigService,
        ScrollService,
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            fullLibraryLoader: () => import('highlight.js'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
