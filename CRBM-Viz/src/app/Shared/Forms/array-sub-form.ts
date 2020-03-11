import { AbstractSubForm } from "./abstract-sub-form";
import { FormArray, FormGroup, AbstractControl } from '@angular/forms';

class ArraySubForm extends AbstractSubForm {
    form: FormArray

    get value(): any {
        return this.form.value
    }
    set value(value: any) {
        this.form.setValue(value)
    }
    get control(): FormArray {
        return this.form
    }
    constructor() {
        super()
        this.form = new FormArray([])
        this.subscriptions.push(
            this.form.valueChanges.subscribe(
                value => {
                    this.onChange(value)
                    this.onTouched()
                }));
    }

    initForm(repeats: number, control: AbstractControl) {
        for (let index = 0; index < repeats; index++) {
            this.addControl(control)
        }

    }
    addControl(control: AbstractControl) {
        this.form.push(control)
        this.form.updateValueAndValidity()
    }

}