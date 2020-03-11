import { FormGroup } from '@angular/forms';
import { AbstractSubForm } from './abstract-sub-form';
import { OnInit } from '@angular/core';

export abstract class ObjectSubForm extends AbstractSubForm {

    constructor() {
        super()
        this.form = new FormGroup({})
        this.subscriptions.push(
            this.form.valueChanges.subscribe(
                value => {
                    this.onChange(value)
                    this.onTouched()
                }
            )
        )
    }
    /**
     * The form control that will hold the input
     *
     * @type {FormControl}
     * @memberof ObjectSubForm
     */
    form: FormGroup

    get control(): FormGroup {
        return this.form
    }

    /**
     * The accessor for the value of the form. Override this in 
     * subclasses to change or manipulate the value returned
     * @type {string}
     * @memberof ObjectSubForm
     */
    get value(): object {
        return this.form.value
    }

    /**
     * Used to set the value. By default, takes in string and sets to string
     * Can be overridden in subclasses with other more complex objects
     * @memberof ObjectSubForm
     */
    set value(object: object) {
        this.form.setValue(object)
        this.onChange(object)
        this.onTouched()


    }

    initForm(formGroup: FormGroup) {
        const formKeys = Object.keys(formGroup.controls)
        formKeys.forEach(key => this.form.addControl(key, formGroup.get(key)))
        this.form.updateValueAndValidity()
    }
}