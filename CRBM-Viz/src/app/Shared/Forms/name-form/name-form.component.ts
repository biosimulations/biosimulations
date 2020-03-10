import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormControlBase } from '../FormControlBase';

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
export class NameFormComponent extends FormControlBase implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    super()
    this.form = new FormControl('', [Validators.required])
    this.subscriptions.push(this.form.valueChanges.subscribe(
      value => {
        this.onChange(value)
        this.onTouched()
      }))
  }


  ngOnInit(): void {
  }




}
