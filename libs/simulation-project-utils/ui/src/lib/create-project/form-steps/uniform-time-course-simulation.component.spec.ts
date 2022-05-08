import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniformTimeCourseSimulationComponent } from './uniform-time-course-simulation.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UniformTimeCourseSimulationComponent', () => {
  let component: UniformTimeCourseSimulationComponent;
  let fixture: ComponentFixture<UniformTimeCourseSimulationComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniformTimeCourseSimulationComponent],
      imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniformTimeCourseSimulationComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
