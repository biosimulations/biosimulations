import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileEditComponent } from './file-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FileEditComponent', () => {
  let component: FileEditComponent;
  let fixture: ComponentFixture<FileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
