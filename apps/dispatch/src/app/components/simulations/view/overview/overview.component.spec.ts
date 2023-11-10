import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
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
      imports: [BiosimulationsIconsModule, MatCardModule, HttpClientTestingModule],
      providers: [ConfigService, SimulationService, Storage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
