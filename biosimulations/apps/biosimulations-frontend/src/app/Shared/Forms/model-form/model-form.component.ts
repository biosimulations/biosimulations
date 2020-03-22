import { Component, OnInit, forwardRef } from '@angular/core';
import { ObjectSubForm } from '../object-sub-form';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModelFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ModelFormComponent),
      multi: true,
    },
  ],
})
export class ModelFormComponent extends ObjectSubForm implements OnInit {
  constructor(private formBuilder: FormBuilder) {
    super();
  }
  set value(val) {
    this.form.patchValue(val);
  }
  get value() {
    return this.form.value;
  }
  get taxonControl() {
    return this.form.controls.taxon;
  }

  ngOnInit(): void {
    const formGroup = this.formBuilder.group({
      format: [''],
      taxon: [''],
      modelFile: [''],
      meta: [''],
    });
    this.initForm(formGroup);
  }
}
