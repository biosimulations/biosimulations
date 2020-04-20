import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFormComponent } from './file-form.component';
import { FormsModule } from '@angular/forms';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';

describe('FileFormComponent', () => {
  let component: FileFormComponent;
  let fixture: ComponentFixture<FileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileFormComponent],
      imports: [BiosimulationsFrontendTestingModule, MaterialFileInputModule],
    }).compileComponents();
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
