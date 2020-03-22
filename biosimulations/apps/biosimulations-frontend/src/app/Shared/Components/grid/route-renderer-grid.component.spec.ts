import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteRendererGridComponent } from './route-renderer-grid.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouteRendererGridComponent', () => {
  let component: RouteRendererGridComponent;
  let fixture: ComponentFixture<RouteRendererGridComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteRendererGridComponent],
      imports: [RouterModule, RouterTestingModule],
      providers: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteRendererGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
