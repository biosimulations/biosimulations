import { OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export abstract class AbstractSubForm implements OnDestroy, ControlValueAccessor {
    /**
     * Holds any subscriptions created in the class to allow for unsubscribing
     * inside onDestroy method
     *
     * @type {Subscription[]}
     * @memberof AbstractSubForm
     */
    subscriptions: Subscription[] = []


    /**
     * The form control that will hold the input. The input from
     * this form should be manipulated into the value property via
     * the accessor methods in all subclasses
     * 
     * @type {FormControl}
     * @memberof AbstractSubForm
     */
    form: AbstractControl


    abstract get value(): any

    abstract set value(value: any)

    abstract get control(): AbstractControl


    get isDisabled(): boolean {
        return this.isDisabled
    }
    set isDisabled(isDisabled: boolean) {
        this.isDisabled = isDisabled
        if (isDisabled) {
            this.form.disable()
        }
        else {
            this.form.enable()
        }
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe())
    }
    onChange: (_: any) => void = () => { }
    onTouched: () => void = () => { }
    writeValue(value: any): void {
        this.value = value
        this.onChange(value)
        this.onTouched()
    }
    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled

    }

    validate(_: FormControl) {
        return this.form.valid ? null : { model: { valid: false } };
    }
}