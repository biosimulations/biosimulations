import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IFormStepComponent, FormStepData, INTEGER_VALIDATOR } from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/config/angular';

@Component({
  selector: 'biosimulations-computational-resources',
  templateUrl: './computational-resources.component.html',
})
export class ComputationalResourcesComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public exampleCombineArchivesUrl?: string;
  public nextClicked = false;
  public emailUrl!: string;
  public updateCallback?: (stepComponent: IFormStepComponent) => void;

  public constructor(formBuilder: UntypedFormBuilder, config: ConfigService) {
    this.formGroup = formBuilder.group({
      cpus: [1, [Validators.required, Validators.min(1), Validators.max(24), INTEGER_VALIDATOR]],
      memory: [8, [Validators.required, Validators.min(0), Validators.max(192)]], // in GB
      maxTime: [20, [Validators.required, Validators.min(0), Validators.max(20 * 24 * 60)]], // in min
    });
    this.emailUrl = 'mailto:' + config.email;
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const cpus = formStepData.cpus;
    if (cpus) {
      this.formGroup.controls.cpus.setValue(cpus);
    }
    const memory = formStepData.memory;
    if (memory) {
      this.formGroup.controls.memory.setValue(memory);
    }
    const maxTime = formStepData.maxTime;
    if (maxTime) {
      this.formGroup.controls.maxTime.setValue(maxTime);
    }
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    return {
      cpus: this.formGroup.controls.cpus.value,
      memory: this.formGroup.controls.memory.value,
      maxTime: this.formGroup.controls.maxTime.value,
    };
  }

  public onUpdate(): void {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }
}
