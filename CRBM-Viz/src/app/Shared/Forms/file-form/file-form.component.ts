import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { FileValidator } from 'ngx-material-file-input';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { RemoteFile } from '../../Models/remote-file';
@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileFormComponent),
      multi: true,
    },
  ],
})
export class FileFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input()
  placeholder = 'Select a file';
  @Input()
  accept = '*';
  @Input()
  disabled = false;

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isDisabled: boolean;
  get value(): File {
    return this.form.value;
  }
  set value(value: File) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  get fileControl() {
    return this.form.controls.file;
  }
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
    if (obj == null) {
      this.form.reset();
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  validate(_: FormControl) {
    return this.form.valid ? null : { model: { valid: false } };
  }
  constructor(private formBuilder: FormBuilder) {
    if (this.disabled) {
      this.form = formBuilder.group({
        file: [{ value: undefined, disabled: true }],
      });
    } else {
      this.form = formBuilder.group({
        file: [''],
      });
    }
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {}
}
