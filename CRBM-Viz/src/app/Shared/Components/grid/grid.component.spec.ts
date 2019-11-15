import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GridComponent } from './grid.component';
import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { SearchToolPanelGridComponent } from '../grid/search-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridComponent, IdRendererGridComponent, SearchToolPanelGridComponent],
      imports: [
        AgGridModule.withComponents([IdRendererGridComponent, SearchToolPanelGridComponent]),
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [
        RouterTestingModule,
        MatDialogModule,
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
