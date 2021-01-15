import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RawSimulationLogComponent } from './raw-simulation-log.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ScrollService } from '@biosimulations/shared/services';
import { RouterTestingModule } from '@angular/router/testing';
describe('RawSimulationLogComponent', () => {
  let component: RawSimulationLogComponent;
  let fixture: ComponentFixture<RawSimulationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RawSimulationLogComponent,
      ],
      imports: [
        SharedUiModule,
        BiosimulationsIconsModule,
        RouterTestingModule,
      ],
      providers: [
        ScrollService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawSimulationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
