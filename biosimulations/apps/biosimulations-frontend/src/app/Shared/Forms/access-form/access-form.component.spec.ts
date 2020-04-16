import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessFormComponent } from './access-form.component';
import { FormsModule } from '@angular/forms';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';
import { MaterialModule } from '../../../app-material.module';

describe('AccessFormComponent', () => {
  let component: AccessFormComponent;
  let fixture: ComponentFixture<AccessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
