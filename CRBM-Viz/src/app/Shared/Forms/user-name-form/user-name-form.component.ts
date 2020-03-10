import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validators } from '@angular/forms';
import { FormControlBase } from '../FormControlBase';

@Component({
  selector: 'app-user-name-form',
  templateUrl: './user-name-form.component.html',
  styleUrls: ['./user-name-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserNameFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UserNameFormComponent),
      multi: true
    }
  ]
})
export class UserNameFormComponent extends FormControlBase implements OnInit {

  constructor() {
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
