import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';

import { Subscription } from 'rxjs';
import { FormatDTO } from '@biosimulations/datamodel/core';

@Component({
  selector: 'app-model-format-form',
  templateUrl: './model-format-form.component.html',
  styleUrls: ['./model-format-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModelFormatFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ModelFormatFormComponent),
      multi: true,
    },
  ],
})
export class ModelFormatFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): FormatDTO {
    return this.form.value;
  }
  set value(value: FormatDTO) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get nameControl() {
    return this.form.controls.name;
  }
  get versionControl() {
    return this.form.controls.version;
  }
  get edamIdControl() {
    return this.form.controls.edamId;
  }
  get urlControl() {
    return this.form.controls.url;
  }
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [''],
      version: [''],
      edamId: [''],
      url: [''],
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      }),
    );
  }

  onChange: any = () => {};
  onTouched: any = () => {};
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { model: { valid: false } };
  }
  ngOnInit(): void {}
}
