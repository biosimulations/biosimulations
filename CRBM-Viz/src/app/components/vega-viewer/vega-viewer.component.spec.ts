import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegaViewerComponent } from './vega-viewer.component';

describe('VegaViewerComponent', () => {
  let component: VegaViewerComponent;
  let fixture: ComponentFixture<VegaViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegaViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
