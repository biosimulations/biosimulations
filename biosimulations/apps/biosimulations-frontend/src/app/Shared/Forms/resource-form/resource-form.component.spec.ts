import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormComponent } from './resource-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;
  const formBuilder = new FormBuilder();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
