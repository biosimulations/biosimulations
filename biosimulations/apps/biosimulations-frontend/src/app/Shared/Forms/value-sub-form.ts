import { FormControl } from '@angular/forms';
import { AbstractSubForm } from './abstract-sub-form';

export abstract class ValueSubForm extends AbstractSubForm {

    constructor() {
        super()
        this.form = new FormControl('')
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
     * @memberof ValueSubForm
     */
    form: FormControl

    get control(): FormControl {
        return this.form
    }

    /**
     * The accessor for the value of the form. Override this in 
     * subclasses to change or manipulate the value returned
     * @type {string}
     * @memberof ValueSubForm
     */
    get value(): string {
        return this.form.value
    }

    /**
     * Used to set the value. By default, takes in string and sets to string
     * Can be overridden in subclasses with other primitive types
     * @memberof ValueSubForm
     */
    set value(id: string) {
        this.form.setValue(id)



    }

}