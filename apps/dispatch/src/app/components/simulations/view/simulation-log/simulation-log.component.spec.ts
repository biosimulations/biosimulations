import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationLogComponent } from './simulation-log.component';
import { StructuredSimulationLogElementComponent } from './structured-simulation-log-element.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ScrollService } from '@biosimulations/shared/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

describe('SimulationLogComponent', () => {
  let component: SimulationLogComponent;
  let fixture: ComponentFixture<SimulationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SimulationLogComponent,
        StructuredSimulationLogElementComponent,
      ],
      imports: [
        HttpClientTestingModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        RouterTestingModule,
        HighlightModule,
      ],
      providers: [
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
    fixture = TestBed.createComponent(SimulationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
