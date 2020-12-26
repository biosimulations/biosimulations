import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { SimulatorImagesComponent } from './simulator-images.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

describe('SimulatorImagesComponent', () => {
  let component: SimulatorImagesComponent;
  let fixture: ComponentFixture<SimulatorImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule, SharedContentModule, HighlightModule],
      providers: [
        RouterTestingModule,
        ConfigService,
        ScrollService,
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            fullLibraryLoader: () => import('highlight.js'),
          }
        }
      ],
      declarations: [SimulatorImagesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
