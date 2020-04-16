import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreviewComponent } from './edit-preview.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('EditPreviewComponent', () => {
  let component: EditPreviewComponent;
  let fixture: ComponentFixture<EditPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPreviewComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
