import { AlgorithmParametersComponent } from './algorithm-parameters.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('UploadModelComponent', () => {
  let component: AlgorithmParametersComponent;
  let fixture: ComponentFixture<AlgorithmParametersComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlgorithmParametersComponent],
      imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmParametersComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
