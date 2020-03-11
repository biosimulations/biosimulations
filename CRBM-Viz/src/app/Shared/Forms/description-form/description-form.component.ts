import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validators } from '@angular/forms';
import { ValueSubForm } from '../value-sub-form';

@Component({
  selector: 'app-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DescriptionFormComponent),
      multi: true
    }
  ]
})
export class DescriptionFormComponent extends ValueSubForm implements OnInit {

  constructor() {
    super();
    this.form = new FormControl('', Validators.required)
    this.form.valueChanges.subscribe(
      value => {
        this.onChange(value)
        this.onTouched()
      }
    )
  }

  ngOnInit(): void {
  }

}
