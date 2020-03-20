import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ArraySubForm } from '../array-sub-form';
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormBuilder,
} from '@angular/forms';
import { PersonInterface } from '../../Models/person.interface';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-authors-form',
  templateUrl: './authors-form.component.html',
  styleUrls: ['./authors-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthorsFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AuthorsFormComponent),
      multi: true,
    },
  ],
})
export class AuthorsFormComponent extends ArraySubForm implements OnInit {
  @Input()
  count = 1;
  formGroup: FormGroup;
  formBuilderInput: { [key: string]: any };
  constructor(private fb: FormBuilder) {
    super();
    this.formBuilderInput = {
      firstName: [''],
      lastName: [''],
      middleName: [''],
    };
  }
  set value(input: PersonInterface[]) {
    // TODO figure out why this check is not covered by super method
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
  addAuthor() {
    const formGroup = this.fb.group(this.formBuilderInput);
    this.addControl(formGroup);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.form.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.form.updateValueAndValidity();
  }
}
