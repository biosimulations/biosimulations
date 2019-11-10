import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseComponent } from './browse.component';
import { DetailsRouteRendererComponent } from './details-route-renderer.component';
import { SearchToolPanelComponent } from './search-tool-panel.component';
import { AgGridModule } from 'ag-grid-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseComponent, DetailsRouteRendererComponent, SearchToolPanelComponent],
      imports: [
        AgGridModule.withComponents([SearchToolPanelComponent]),
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
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DetailsRouteRendererComponent],
      },
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
