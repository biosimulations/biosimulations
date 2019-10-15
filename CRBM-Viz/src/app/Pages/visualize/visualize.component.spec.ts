import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeComponent } from './visualize.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VisualizeComponent', () => {
  let component: VisualizeComponent;
  let fixture: ComponentFixture<VisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
