import { Component } from '@angular/core';
import { FormStepComponent, FormStepData } from './form-step';
import { AlgorithmParameterMap } from '@biosimulations/simulation-project-utils/service';

interface AlgorithmParameterRow {
  name: string;
  url: string;
  simulators: string;
  type: string;
  formattedValue: string;
  formattedRecommendedRangeJoined: string;
  id: string;
}

@Component({
  selector: 'create-project-algorithm-parameters',
  templateUrl: './algorithm-parameters.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class AlgorithmParametersComponent implements FormStepComponent {
  public nextClicked = false;
  public parameterRows: AlgorithmParameterRow[] = [];
  public parameters: AlgorithmParameterMap = {};

  public setup(parameters: AlgorithmParameterMap): void {
    if (!parameters) {
      return;
    }
    this.parameters = parameters;
    this.parameterRows = [];
    const paramIds = Object.keys(parameters);
    paramIds.forEach((paramId: string): void => {
      const paramData = parameters[paramId];
      const multipleRange = paramData.multipleRecommendedRange;
      const formattedRange = multipleRange ? '--multiple--' : paramData.parameter.formattedRecommendedRangeJoined;
      const paramRow = {
        name: paramData.parameter.name,
        url: paramData.parameter.url,
        simulators: Array.from(paramData.simulators).sort().join(', '),
        type: paramData.multipleType ? '--multiple--' : paramData.parameter.type,
        formattedValue: paramData.multipleValue ? '--multiple--' : paramData.parameter.formattedValue,
        formattedRecommendedRangeJoined: formattedRange,
        id: paramData.parameter.id,
      };
      this.parameterRows.push(paramRow);
    });
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    if (!formStepData) {
      return;
    }
    this.setup(formStepData.algorithmParameters as AlgorithmParameterMap);
  }

  public getFormStepData(): FormStepData {
    return {
      algorithmParameters: this.parameters,
    };
  }
}
