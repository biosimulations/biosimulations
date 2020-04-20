import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFormComponent } from './name-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
