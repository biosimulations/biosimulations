import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NpnSliderModule } from 'npn-slider';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TableControlsComponent } from './table-controls.component';
import { TableComponent } from './table.component';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('TableControlsComponent', () => {
  let component: TableControlsComponent;
  let fixture: ComponentFixture<TableControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatExpansionModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NpnSliderModule,
        BiosimulationsIconsModule,
        MatTooltipModule,
      ],
      declarations: [TableControlsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableControlsComponent);
    component = fixture.componentInstance;
    component.table = {} as TableComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
