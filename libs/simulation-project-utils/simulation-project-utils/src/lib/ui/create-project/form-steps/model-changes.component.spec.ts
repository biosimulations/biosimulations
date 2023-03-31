import { ModelChangesComponent } from './model-changes.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BiosimulationsIconsModule } from 'libs/shared/icons/src';

describe('ModelChangesComponent', () => {
  let component: ModelChangesComponent;
  let fixture: ComponentFixture<ModelChangesComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelChangesComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        BiosimulationsIconsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelChangesComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
