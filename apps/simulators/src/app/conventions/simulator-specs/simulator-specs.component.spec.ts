import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { SimulatorSpecsComponent } from './simulator-specs.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

describe('SimulatorSpecsComponent', () => {
  let component: SimulatorSpecsComponent;
  let fixture: ComponentFixture<SimulatorSpecsComponent>;

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
      declarations: [SimulatorSpecsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
