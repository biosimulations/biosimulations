import { FormGroup } from '@angular/forms';
import { AbstractSubForm } from './abstract-sub-form';
import { OnInit } from '@angular/core';

export abstract class ObjectSubForm extends AbstractSubForm {
  /**
   * Creates an instance of ObjectSubForm.  Creates a root formgroup. Sends form group changes to parent by calling onchange and on touched
   * @memberof ObjectSubForm
   */
  constructor() {
    super();
    this.form = new FormGroup({});
    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  /**
   * The form control that will hold the input
   *
   * @type {FormControl}
   * @memberof ObjectSubForm
   */
  form: FormGroup;

  get control(): FormGroup {
    return this.form;
  }

  /**
   * The accessor for the value of the form. Override this in
   * subclasses to change or manipulate the value returned
   */
  get value(): object {
    return this.form.value;
  }

  /**
   * Used to set the value. By default, takes in string and sets to string
   * Can be overridden in subclasses with other more complex objects.
   * @memberof ObjectSubForm
   */
  set value(object: object) {
    this.form.setValue(object);
  }

  /**
   *
   *
   * @param {FormGroup} formGroup
   * @memberof ObjectSubForm
   */
  initForm(formGroup: FormGroup) {
    const formKeys = Object.keys(formGroup.controls);
    formKeys.forEach(key => this.form.addControl(key, formGroup.get(key)));
    this.form.updateValueAndValidity();
  }
}
