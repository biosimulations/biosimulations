import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameFormComponent } from './user-name-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('UserNameFormComponent', () => {
  let component: UserNameFormComponent;
  let fixture: ComponentFixture<UserNameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNameFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
