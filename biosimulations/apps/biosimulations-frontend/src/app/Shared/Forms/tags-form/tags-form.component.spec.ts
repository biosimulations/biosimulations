import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsFormComponent } from './tags-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('TagsFormComponent', () => {
  let component: TagsFormComponent;
  let fixture: ComponentFixture<TagsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
