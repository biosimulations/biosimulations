import { OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export class FormControlBase implements OnDestroy, ControlValueAccessor {
    subscriptions: Subscription[] = []
    form: FormControl

    get control() {
        return this.form
    }

    /**
     * The accessor for the value of the form. Override this in 
     * subclasses to change or manipulate the value returned
     * @type {string}
     * @memberof FormControlBase
     */
    get value(): string {
        return this.form.value
    }

    /**
     * Used to set the value. By default, takes in string and sets to string
     * Should be overridden in subclasses with more complex data types
     * @memberof FormControlBase
     */
    set value(id: string) {
        this.form.setValue(id)
        this.onChange(id)
        this.onTouched()
    }
    get isDisabled() {
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