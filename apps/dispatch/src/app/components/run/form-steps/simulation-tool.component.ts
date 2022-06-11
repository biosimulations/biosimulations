import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';
import { DispatchFormOption } from '.';

@Component({
  selector: 'biosimulations-simulation-tool',
  templateUrl: './simulation-tool.component.html',
})
export class SimulationToolComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public exampleCombineArchivesUrl?: string;
  public nextClicked = false;
  public updateCallback?: (stepComponent: IFormStepComponent) => void;
  public simulators?: DispatchFormOption[];
  public simulatorVersions: DispatchFormOption[] = [];

  public constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      simulator: ['', [Validators.required]],
      simulatorVersion: ['', [Validators.required]],
    });
  }

  public setup(exampleUrl: string, simulators: DispatchFormOption[], simulatorVersions: DispatchFormOption[]): void {
    this.exampleCombineArchivesUrl = exampleUrl;
    this.simulators = simulators;
    this.simulatorVersions = simulatorVersions;

    // If only one simulator is enabled preselect it.
    const enabledSimulatorOptions = simulators.filter((option: DispatchFormOption) => {
      return !option.disabled;
    });
    if (enabledSimulatorOptions.length === 1) {
      this.formGroup.controls.simulator.setValue(enabledSimulatorOptions[0].id);
    }

    // If only one version is available preselect it, otherwise clear the previous value.
    if (simulatorVersions.length === 1) {
      this.formGroup.controls.simulatorVersion.setValue(simulatorVersions[0].id);
    } else {
      this.formGroup.controls.simulatorVersion.setValue(null);
    }

    // If there aren't any simulator versions (no simulator selected) then disable the dropdown.
    if (simulatorVersions.length === 0) {
      this.formGroup.controls.simulatorVersion.disable();
    } else {
      this.formGroup.controls.simulatorVersion.enable();
    }
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const simulator = formStepData.simulator;
    if (simulator) {
      this.formGroup.controls.simulator.setValue(simulator);
    }
    const simulatorVersion = formStepData.simulatorVersion;
    if (simulatorVersion) {
      this.formGroup.controls.simulatorVersion.setValue(simulatorVersion);
    }
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    const simulator = this.formGroup.controls.simulator.value;
    const simulatorVersion = this.formGroup.controls.simulatorVersion.value;
    return {
      simulator: simulator,
      simulatorVersion: simulatorVersion,
    };
  }

  public toolSelected(): void {
    this.formGroup.controls.simulatorVersion.setValue(null);
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }

  public versionSelected(): void {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }

  public shouldShowSimulatorRequiredError(): boolean {
    return this.nextClicked && this.formGroup.hasError('required', 'simulator');
  }

  public shouldShowSimulatorVersionRequiredError(): boolean {
    const invalid = this.formGroup.hasError('required', 'simulatorVersion');
    return this.nextClicked && invalid && !this.shouldShowSimulatorRequiredError();
  }
}
