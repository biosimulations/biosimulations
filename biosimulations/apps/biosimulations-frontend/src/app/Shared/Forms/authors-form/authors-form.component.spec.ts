import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsFormComponent } from './authors-form.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../app-material.module';
import { SharedModule } from '../../shared.module';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('AuthorsFormComponent', () => {
  let component: AuthorsFormComponent;
  let fixture: ComponentFixture<AuthorsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorsFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
