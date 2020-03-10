import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { FormControlBase } from '../FormControlBase';

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
export class DescriptionFormComponent extends FormControlBase implements OnInit {

  constructor() {
    super();
    this.form = new FormControl('')
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
