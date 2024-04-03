import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Make sure to import MatSnackBarModule
import { OverviewComponent } from './overview.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService } from '@biosimulations/config/angular';
import { SimulationService } from '../../../../services/simulation/simulation.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      imports: [BiosimulationsIconsModule, MatCardModule, MatSnackBarModule, HttpClientTestingModule], // Include MatSnackBarModule
      providers: [ConfigService, SimulationService, Storage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    // Mock the @Input properties
    component.hasSbml = true; // Assuming true for this example. Adjust as necessary.
    // Now, call detectChanges after initializing the inputs
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
