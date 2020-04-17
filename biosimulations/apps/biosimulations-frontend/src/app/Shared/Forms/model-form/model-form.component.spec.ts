import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFormComponent } from './model-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';
import {
  NO_ERRORS_SCHEMA,
  Directive,
  Component,
  forwardRef,
} from '@angular/core';
import {
  FormBuilder,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { FileFormComponent } from '../file-form/file-form.component';
import { ModelFormatFormComponent } from '../model-format-form/model-format-form.component';
import { TaxonFormComponent } from '../taxon-form/taxon-form.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ObjectSubForm } from '../object-sub-form';

@Component({
  selector: 'app-resource-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockResourceFormComponent),
      multi: true,
    },
  ],
})
class MockResourceFormComponent extends ObjectSubForm {}
@Component({
  selector: 'app-taxon-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockTaxonFormComponent),
      multi: true,
    },
  ],
})
class MockTaxonFormComponent extends ObjectSubForm {}
@Component({
  selector: 'app-model-format-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockModelFormatFormComponent),
      multi: true,
    },
  ],
})
class MockModelFormatFormComponent extends ObjectSubForm {}
@Component({
  selector: 'app-file-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFileFormComponent),
      multi: true,
    },
  ],
})
class MockFileFormComponent extends ObjectSubForm {}
describe('ModelFormComponent', () => {
  let component: ModelFormComponent;
  let fixture: ComponentFixture<ModelFormComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModelFormComponent,
        MockFileFormComponent,
        MockModelFormatFormComponent,
        MockTaxonFormComponent,
        MockResourceFormComponent,
      ],
      imports: [BiosimulationsFrontendTestingModule],
      providers: [
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
