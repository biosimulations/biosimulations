import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VisualizationsGridComponent } from './visualizations-grid.component';
import { GridComponent } from '../grid/grid.component';
import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { IdRouteRendererGridComponent } from '../grid/id-route-renderer-grid.component';
import { RouteRendererGridComponent } from '../grid/route-renderer-grid.component';
import { SearchToolPanelGridComponent } from '../grid/search-tool-panel-grid.component';
import { SortToolPanelGridComponent } from '../grid/sort-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

describe('VisualizationsGridComponent', () => {
  let component: VisualizationsGridComponent;
  let fixture: ComponentFixture<VisualizationsGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VisualizationsGridComponent,
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
    fixture = TestBed.createComponent(VisualizationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
