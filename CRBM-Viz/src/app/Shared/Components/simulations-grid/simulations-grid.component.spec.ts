import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimulationsGridComponent } from './simulations-grid.component';
import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { SearchToolPanelGridComponent } from '../grid/search-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

describe('SimulationsGridComponent', () => {
  let component: SimulationsGridComponent;
  let fixture: ComponentFixture<SimulationsGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimulationsGridComponent, IdRendererGridComponent, SearchToolPanelGridComponent],
      imports: [
        AgGridModule.withComponents([IdRendererGridComponent, SearchToolPanelGridComponent]),
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(SimulationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
