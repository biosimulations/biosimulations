import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencesFormComponent } from './references-form.component';
import { FormsModule } from '@angular/forms';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('ReferencesFormComponent', () => {
  let component: ReferencesFormComponent;
  let fixture: ComponentFixture<ReferencesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferencesFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
