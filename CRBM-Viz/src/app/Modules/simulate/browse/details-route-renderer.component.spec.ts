import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRouteRendererComponent } from './details-route-renderer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DetailsRouteRendererComponent', () => {
  let component: DetailsRouteRendererComponent;
  let fixture: ComponentFixture<DetailsRouteRendererComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsRouteRendererComponent],
      imports: [RouterTestingModule],
      providers: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRouteRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
