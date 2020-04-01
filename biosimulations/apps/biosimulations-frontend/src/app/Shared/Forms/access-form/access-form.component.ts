import { Component, OnInit, forwardRef } from '@angular/core';
import { ValueSubForm } from '../value-sub-form';
import { AccessLevel, accessLevels } from '@biosimulations/datamodel/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-access-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccessFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AccessFormComponent),
      multi: true,
    },
  ],
})
export class AccessFormComponent extends ValueSubForm implements OnInit {
  accessLevels: { value: AccessLevel; name: string }[];
  constructor() {
    super();
    this.accessLevels = accessLevels;
  }

  ngOnInit(): void {}
}
