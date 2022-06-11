import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';
import { DispatchFormOption } from '.';

@Component({
  selector: 'biosimulations-project-capabilities',
  templateUrl: './project-capabilities.component.html',
})
export class ProjectCapabilitiesComponent implements IFormStepComponent {
  public nextClicked = false;
  public formGroup: UntypedFormGroup;
  public modelFormats?: DispatchFormOption[];
  public algorithms?: DispatchFormOption[];
  public substitutionLevels?: DispatchFormOption[];
  public updateCallback?: (stepComponent: IFormStepComponent) => void;
  public showInvalidModelError = false;
  public showInvalidAlgorithmError = false;

  public constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      modelFormats: ['', []],
      simulationAlgorithms: ['', []],
      simulationAlgorithmSubstitutionPolicy: ['', []],
    });
  }

  public setup(
    modelFormats: DispatchFormOption[],
    algorithms: DispatchFormOption[],
    substitutionLevels: DispatchFormOption[],
    showInvalidModelError: boolean,
    showInvalidAlgorithmError: boolean,
  ): void {
    this.modelFormats = modelFormats;
    this.algorithms = algorithms;
    this.substitutionLevels = substitutionLevels;
    this.showInvalidModelError = showInvalidModelError;
    this.showInvalidAlgorithmError = showInvalidAlgorithmError;
    this.makeDefaultSelections();
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelFormats = formStepData.modelFormats as string[];
    this.formGroup.controls.modelFormats.setValue(modelFormats);
    const algorithms = formStepData.simulationAlgorithms as string[];
    this.formGroup.controls.simulationAlgorithms.setValue(algorithms);
    const substitutionPolicy = formStepData.substitutionPolicy;
    if (substitutionPolicy) {
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.setValue(substitutionPolicy);
    }
  }

  public getFormStepData(): FormStepData {
    const modelFormats = this.formGroup.controls.modelFormats.value;
    const algorithms = this.formGroup.controls.simulationAlgorithms.value;
    const substitutionPolicy = this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.value;
    return {
      modelFormats: modelFormats,
      simulationAlgorithms: algorithms,
      substitutionPolicy: substitutionPolicy,
    };
  }

  public selectionsUpdated(): void {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }

  private makeDefaultSelections(): void {
    if (!this.substitutionLevels || !this.algorithms || !this.modelFormats) {
      return;
    }
    if (this.substitutionLevels.length == 1) {
      const policyId = this.substitutionLevels[0].id;
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.setValue(policyId);
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.disable();
    } else if (this.substitutionLevels.length > 1) {
      const policyId = this.substitutionLevels[this.substitutionLevels.length - 1].id;
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.setValue(policyId);
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.enable();
    }
  }
}
