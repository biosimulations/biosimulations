import { Component, OnInit, forwardRef } from '@angular/core';
import { ValueSubForm } from '../value-sub-form';
import { licenses } from 'src/app/Shared/Enums/license';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
@Component({
  selector: 'app-license-form',
  templateUrl: './license-form.component.html',
  styleUrls: ['./license-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LicenseFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LicenseFormComponent),
      multi: true,
    },
  ],
})
export class LicenseFormComponent extends ValueSubForm implements OnInit {
  licenses = licenses;
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
