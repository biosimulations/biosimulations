import { NamespacesComponent } from './namespaces.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from 'libs/shared/icons/src';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('NamespacesComponent', () => {
  let component: NamespacesComponent;
  let fixture: ComponentFixture<NamespacesComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NamespacesComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        NoopAnimationsModule,
        BiosimulationsIconsModule,
        MatFormFieldModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespacesComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
