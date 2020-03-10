import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormControlBase } from 'src/app/Shared/Forms/FormControlBase'
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
export class IdentifierFormComponent extends FormControlBase implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    super();
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

}
