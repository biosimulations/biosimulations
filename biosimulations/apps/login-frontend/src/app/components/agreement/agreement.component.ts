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
  selector: 'biosimulations-login-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgreementComponent),
      multi: true,
    },
  ],
})
export class AgreementComponent implements OnInit, ControlValueAccessor {
  @Input()
  agreementUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/CODE_OF_CONDUCT.md';

  agreed = false;

  isDisabled: boolean;
  private onChange: (_: any) => void = _ => {};

  constructor(private cd: ChangeDetectorRef) {}
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
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleAgreed(event) {
    this.writeValue(event.checked);
  }
  ngOnInit(): void {}
}
