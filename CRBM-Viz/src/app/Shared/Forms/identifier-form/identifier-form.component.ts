import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-identifier-form',
  templateUrl: './identifier-form.component.html',
  styleUrls: ['./identifier-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentifierFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentifierFormComponent),
      multi: true,
    }

  ]
})
export class IdentifierFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  subscriptions: Subscription[] = []
  form: FormControl
  isDisabled = false;

  get value(): string {
    return this.form.value
  }
  set value(id: string) {
    this.form.setValue(id)
    this.onChange(id)
    this.onTouched()
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
  onChange: (_: any) => void = () => { }
  onTouched: () => void = () => { }
  writeValue(value: any): void {
    this.value = value
  }
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled
    if (isDisabled) {
      this.form.disable()
    }
    else {
      this.form.enable()
    }
  }
  get idControl() {
    return this.form
  }
  constructor(private formBuilder: FormBuilder) {
    this.form = new FormControl('')
    this.subscriptions.push(
      this.form.valueChanges.subscribe(
        value => {
          this.onChange(value)
          this.onTouched()
        }
      )
    )
  }

  ngOnInit(): void {
  }
  validate(_: FormControl) {
    return this.form.valid ? null : { model: { valid: false } };
  }
}
