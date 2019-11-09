import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchToolPanelComponent } from './search-tool-panel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SearchToolPanelComponent', () => {
  let component: SearchToolPanelComponent;
  let fixture: ComponentFixture<SearchToolPanelComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchToolPanelComponent],
      imports: [RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchToolPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
