import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChartTypesGridComponent } from './chart-types-grid.component';
import { GridComponent } from '../grid/grid.component';
import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { IdRouteRendererGridComponent } from '../grid/id-route-renderer-grid.component';
import { RouteRendererGridComponent } from '../grid/route-renderer-grid.component';
import { SearchToolPanelGridComponent } from '../grid/search-tool-panel-grid.component';
import { SortToolPanelGridComponent } from '../grid/sort-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

describe('ChartTypesGridComponent', () => {
  let component: ChartTypesGridComponent;
  let fixture: ComponentFixture<ChartTypesGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartTypesGridComponent,
        GridComponent,
        IdRendererGridComponent,
        IdRouteRendererGridComponent,
        RouteRendererGridComponent,
        SearchToolPanelGridComponent,
        SortToolPanelGridComponent,
      ],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
        AgGridModule.withComponents([
          IdRendererGridComponent,
          IdRouteRendererGridComponent,
          RouteRendererGridComponent,
          SearchToolPanelGridComponent,
          SortToolPanelGridComponent,
        ]),
      ],
      providers: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
