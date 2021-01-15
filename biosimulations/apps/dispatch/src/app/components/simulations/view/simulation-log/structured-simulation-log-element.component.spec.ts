import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructuredSimulationLogElementComponent } from './structured-simulation-log-element.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ScrollService } from '@biosimulations/shared/services';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('StructuredSimulationLogElementComponent', () => {
  let component: StructuredSimulationLogElementComponent;
  let fixture: ComponentFixture<StructuredSimulationLogElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StructuredSimulationLogElementComponent,
      ],
      imports: [
        HttpClientTestingModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        RouterTestingModule
      ],
      providers: [
        ScrollService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredSimulationLogElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
