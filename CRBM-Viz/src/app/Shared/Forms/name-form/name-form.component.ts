import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NameFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NameFormComponent),
      multi: true

    }
  ]
})
export class NameFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  subscriptions: Subscription[] = []
  form: FormControl;

  get value(): string {
    return this.form.value
  }

  set value(value: string) {
    if (value === null) {
      this.form.reset()
    }
    else {
      this.form.setValue(value)
      this.onChange(value)
      this.onTouched()
    }
  }
  get isDisabled() {
    return this.isDisabled
  }
  set isDisabled(isDisabled: boolean) {
    this.isDisabled = isDisabled
    if (isDisabled) {
      this.form.disable()
    }
    else {
      this.form.enable()
    }

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe)
  }
  onChange: (_: any) => void = () => { }
  onTouched: () => void = () => { }
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { model: { valid: false } };
  }



  constructor(private formBuilder: FormBuilder) {
    this.form = new FormControl('', [Validators.required])
    this.subscriptions.push(this.form.valueChanges.subscribe(
      value => {
        this.onChange(value)
        this.onTouched()
      }))
  }

  get nameControl() {
    return this.form
  }
  ngOnInit(): void {
  }




}
