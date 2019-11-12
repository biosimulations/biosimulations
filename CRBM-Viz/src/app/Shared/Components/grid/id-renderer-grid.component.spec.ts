import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdRendererGridComponent } from './id-renderer-grid.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('IdRendererGridComponent', () => {
  let component: IdRendererGridComponent;
  let fixture: ComponentFixture<IdRendererGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdRendererGridComponent],
      imports: [RouterModule, RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdRendererGridComponent);
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
