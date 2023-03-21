import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-notifications-form',
  templateUrl: './notifications.component.html',
  styleUrls: ['../dispatch/dispatch.component.scss'],
})
export class NotificationsComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public nextClicked = false;

  public constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group(
      {
        email: ['', [Validators.email]],
        emailConsent: [false],
      },
      {
        validators: this.formValidator.bind(this),
      },
    );
  }

  public populateFormFromFormStepData(_formStepData: FormStepData): void {
    return;
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    return {
      email: this.formGroup.controls.email.value,
    };
  }

  private formValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};

    const email = formGroup.controls.email as FormControl;
    const emailConsent = formGroup.controls.emailConsent as FormControl;
    if (email.value && !email.hasError('email') && !emailConsent.value) {
      errors['emailNotConsented'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }
}
