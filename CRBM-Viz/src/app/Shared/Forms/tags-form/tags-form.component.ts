import { Component, OnInit, forwardRef } from '@angular/core';
import { ArraySubForm } from '../array-sub-form';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TagsFormComponent),
      multi: true,
    },
  ],
})
export class TagsFormComponent extends ArraySubForm implements OnInit {
  readonly chipSeparatorKeyCodes: number[] = [ENTER, COMMA];

  constructor(private formBuilder: FormBuilder) {
    super();
  }
  drop(formArray: FormArray, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      formArray.controls,
      event.previousIndex,
      event.currentIndex
    );
  }
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    let value: string = event.value;

    // Add tag
    value = (value || '').trim();
    if (value && !this.control.value.includes(value)) {
      const formArray: FormArray = this.control;
      formArray.push(this.formBuilder.control(value));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  set value(input: string[]) {
    if (input) {
      this.count = input.length - 1;
      const formGroup = this.formBuilder.group(this.formBuilderInput);
      this.initForm(this.count, formGroup);
      this.form.patchValue(input);
    }
  }
  ngOnInit(): void {}
}
