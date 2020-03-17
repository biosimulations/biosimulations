import { Component, OnInit, forwardRef } from '@angular/core';
import { ArraySubForm } from '../array-sub-form';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder } from '@angular/forms';
import {
  JournalReference,
  JournalReferenceSerialized,
} from '../../Models/journal-reference';

@Component({
  selector: 'app-references-form',
  templateUrl: './references-form.component.html',
  styleUrls: ['./references-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReferencesFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ReferencesFormComponent),
      multi: true,
    },
  ],
})
export class ReferencesFormComponent extends ArraySubForm implements OnInit {
  constructor(private fb: FormBuilder) {
    super();
    this.formBuilderInput = {
      authors: [''],
      title: [''],
      journal: [''],
      volume: [''],
      number: [''],
      pages: [''],
      year: [''],
      doi: [''],
    };
  }

  set value(refs: JournalReferenceSerialized[]) {
    this.form.patchValue(refs);
  }

  ngOnInit(): void {}

  addRef(): void {
    const formGroup = this.fb.group(this.formBuilderInput);
    this.addControl(formGroup);
  }
}
