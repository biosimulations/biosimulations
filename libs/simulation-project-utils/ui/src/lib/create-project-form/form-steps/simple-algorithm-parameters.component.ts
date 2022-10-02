import { Component } from '@angular/core';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';
import { SedAlgorithmParameterChange } from '@biosimulations/datamodel/common';

@Component({
  selector: 'create-project-simple-algorithm-parameters',
  templateUrl: './simple-algorithm-parameters.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class SimpleAlgorithmParametersComponent implements IFormStepComponent {
  public nextClicked = false;
  public parameters: SedAlgorithmParameterChange[] = [];

  public setup(parameters: SedAlgorithmParameterChange[]): void {
    this.parameters = parameters;
  }

  public populateFormFromFormStepData(_formStepData: FormStepData): void {
    return;
  }

  public getFormStepData(): FormStepData {
    return {};
  }
}
