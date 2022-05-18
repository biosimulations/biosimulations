import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaletteService } from '../palette-service/palette.service';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      providers: [
        {
          provide: PaletteService,
          useValue: {
            getColorPalette: (count: number) => {
              return ['#ffffff'];
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
