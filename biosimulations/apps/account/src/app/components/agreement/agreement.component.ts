import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'biosimulations-login-agreement[agreementUrl]',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => AgreementComponent),
      multi: true,
    },
  ],
})
export class AgreementComponent implements OnInit, ControlValueAccessor {
  @Input()
  agreementUrl = '';

  @Input()
  checkboxMessage = 'I agree';
  agreed = false;
  isDisabled = false;
  private onChange: (_: any) => void = (_) => {};

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.agreementUrl === '') {
      throw TypeError('Need to provide a URL');
    }
  }

  onTouched: () => void = () => {};
  get value(): boolean {
    return true;
  }
  set value(value: boolean) {
    if (value) {
      this.writeValue(value);
    }
  }
  writeValue(value: boolean): void {
    this.agreed = value;
    this.onChange(value);
    this.onTouched();
    this.cd.detectChanges();
  }
  registerOnChange(fn: (_: any) => any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleAgreed(event: any) {
    this.writeValue(event.checked);
  }
}
