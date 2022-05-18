import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { StatisticViewerComponent } from './statistic-viewer.component';

describe('StatisticViewerComponent', () => {
  let component: StatisticViewerComponent;
  let fixture: ComponentFixture<StatisticViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticViewerComponent],
      imports: [MatCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
