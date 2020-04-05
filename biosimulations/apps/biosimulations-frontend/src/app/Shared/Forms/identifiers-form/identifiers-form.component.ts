import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ArraySubForm } from '../array-sub-form';
import { IdentifierDTO } from '@biosimulations/datamodel/core';

@Component({
  selector: 'app-identifiers-form',
  templateUrl: './identifiers-form.component.html',
  styleUrls: ['./identifiers-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentifiersFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentifiersFormComponent),
      multi: true,
    },
  ],
})
export class IdentifiersFormComponent extends ArraySubForm implements OnInit {
  @Input()
  count = 1;
  formGroup: FormGroup;
  formBuilderInput: { [key: string]: any };
  constructor(private fb: FormBuilder) {
    super();
    this.formBuilderInput = {
      namespace: [''],
      identifier: [''],
    };
  }

  set value(input: IdentifierDTO[]) {
    //  TODO Abstract this common logic
    if (input) {
      this.count = input.length - 1;
      const formGroup = this.fb.group(this.formBuilderInput);
      this.initForm(this.count, formGroup);
      this.form.setValue(input);
    }
  }
  get value() {
    return this.form.value;
  }

  ngOnInit(): void {
    const formGroup = this.fb.group(this.formBuilderInput);
    this.initForm(this.count, formGroup);
  }
  addIdentifier() {
    const formGroup = this.fb.group(this.formBuilderInput);
    this.addControl(formGroup);
  }
}
