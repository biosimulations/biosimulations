import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFormComponent } from './file-form.component';

describe('FileFormComponent', () => {
  let component: FileFormComponent;
  let fixture: ComponentFixture<FileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
