import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdRouteRendererGridComponent } from './id-route-renderer-grid.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('IdRouteRendererGridComponent', () => {
  let component: IdRouteRendererGridComponent;
  let fixture: ComponentFixture<IdRouteRendererGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdRouteRendererGridComponent],
      imports: [RouterModule, RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdRouteRendererGridComponent);
    component = fixture.componentInstance;
    component.icon = {
      type: 'mat',
      icon: 'timeline',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
