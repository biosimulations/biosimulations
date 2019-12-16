import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortToolPanelGridComponent } from './sort-tool-panel-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SortToolPanelGridComponent', () => {
  let component: SortToolPanelGridComponent;
  let fixture: ComponentFixture<SortToolPanelGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortToolPanelGridComponent],
      imports: [RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortToolPanelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
