import { OnDestroy } from "@angular/core";
import { ControlValueAccessor, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export class FormControlBase implements OnDestroy, ControlValueAccessor {
    subscriptions: Subscription[] = []
    form: FormControl
    isDisabled = false;
    get control() {
        return this.form
    }
    get value(): string {
        return this.form.value
    }
    set value(id: string) {
        this.form.setValue(id)
        this.onChange(id)
        this.onTouched()
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
        if (isDisabled) {
            this.form.disable()
        }
        else {
            this.form.enable()
        }
    }

    validate(_: FormControl) {
        return this.form.valid ? null : { model: { valid: false } };
    }
}