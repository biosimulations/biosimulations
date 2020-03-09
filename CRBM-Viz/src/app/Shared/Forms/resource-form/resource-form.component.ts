import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS
} from '@angular/forms'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ResourceFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ResourceFormComponent),
      multi: true,
    }]
})
export class ResourceFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  get value(): any {
    return this.form.value
  }
  set value(value: any) {
    this.form.setValue(value)
    this.onChange(value)
    this.onTouch()
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [''],
      image: [''],
      description: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],

    })
    this.subscriptions.push(this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouch()
    }))
  }
  subscriptions: Subscription[] = []
  form: FormGroup;
  onTouch: any = () => { }
  onChange: any = () => { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe)

  }
  writeValue(obj: any): void {
    if (obj === null) {
      this.form.reset()
    }
    else {
      this.form.setValue(obj)
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

}
