import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationContainerComponent } from './visualisation-container.component';

describe('VisualisationContainerComponent', () => {
  let component: VisualisationContainerComponent;
  let fixture: ComponentFixture<VisualisationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualisationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualisationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
