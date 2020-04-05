import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ObjectSubForm } from '../object-sub-form';

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
    },
  ],
})
export class ResourceFormComponent extends ObjectSubForm implements OnInit {
  imageControl: FormControl;

  get value(): any {
    return this.form.value;
  }
  set value(value: any) {
    this.form.patchValue(value);
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    const formGroup = this.formBuilder.group({
      id: [''],
      name: [''],
      description: [''],
      access: [''],
      accessToken: [''],
      created: [''],
      updated: [''],
      owner: [''],
      license: [''],
      tags: [''],
      authors: [''],
      identifiers: [''],
      imageFile: [''],
      refs: [''],
    });
    super.initForm(formGroup);
  }
}
