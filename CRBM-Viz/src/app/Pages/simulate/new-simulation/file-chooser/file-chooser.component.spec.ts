import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileChooserComponent } from './file-chooser.component';

describe('FileChooserComponent', () => {
  let component: FileChooserComponent;
  let fixture: ComponentFixture<FileChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
