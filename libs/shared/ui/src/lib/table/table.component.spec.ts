import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FullPageSpinnerComponent } from '../spinner/full-page-spinner.component';
import { TableComponent } from './table.component';
import { TableTabularDataComponent } from './table-tabular-data.component';
import { TableControlsComponent } from './table-controls.component';
import { TableDataComponent } from './table.interface';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatExpansionModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BiosimulationsIconsModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
      ],
      declarations: [
        TableComponent,
        TableTabularDataComponent,
        TableControlsComponent,
        SpinnerComponent,
        FullPageSpinnerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.dataContainer = {
      materialTable: {},
      materialPaginator: {},
      materialSort: {},
    } as TableDataComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
