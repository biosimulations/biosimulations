import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-metadata-form',
  templateUrl: './metadata.component.html',
})
export class MetadataComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public exampleCombineArchivesUrl?: string;
  public nextClicked = false;
  public updateCallback?: (stepComponent: IFormStepComponent) => void;

  public constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    this.formGroup.controls.name.setValue(formStepData.name);
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    return {
      name: this.formGroup.controls.name.value,
    };
  }

  public onUpdate(): void {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }

  public shouldShowNameRequiredError(): boolean {
    return this.nextClicked && this.formGroup.hasError('required', 'name');
  }
}
