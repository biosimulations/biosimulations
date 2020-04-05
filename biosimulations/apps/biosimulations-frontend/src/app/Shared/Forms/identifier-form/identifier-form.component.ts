import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValueSubForm } from '../../Forms/value-sub-form';
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
    },
  ],
})
export class IdentifierFormComponent extends ValueSubForm implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form.setValidators(Validators.required);
    this.form.updateValueAndValidity();
  }
}
