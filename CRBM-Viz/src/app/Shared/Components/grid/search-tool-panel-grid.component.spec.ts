import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchToolPanelGridComponent } from './search-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SearchToolPanelGridComponent', () => {
  let component: SearchToolPanelGridComponent;
  let fixture: ComponentFixture<SearchToolPanelGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchToolPanelGridComponent],
      imports: [RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchToolPanelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
