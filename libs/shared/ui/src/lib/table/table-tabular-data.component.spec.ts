import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TableTabularDataComponent } from './table-tabular-data.component';
import { TableComponent } from './table.component';

describe('TableTabularDataComponent', () => {
  let component: TableTabularDataComponent;
  let fixture: ComponentFixture<TableTabularDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MatTableModule, MatSortModule, BiosimulationsIconsModule],
      declarations: [TableTabularDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTabularDataComponent);
    component = fixture.componentInstance;
    component.table = {} as TableComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
