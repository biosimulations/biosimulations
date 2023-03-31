import { Component } from '@angular/core';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import {
  MultipleSimulatorsAlgorithmParameter,
  SimulatorSpecs,
  GatherCompatibleSimulators,
  UpdateParameterCompatibility,
  CompatibleSimulator,
} from '../../../index';
import { AlgorithmSubstitution } from '@biosimulations/datamodel/common';

@Component({
  selector: 'create-project-algorithm-parameters',
  templateUrl: './algorithm-parameters.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class AlgorithmParametersComponent implements IFormStepComponent {
  public nextClicked = false;
  public parameterRows: Record<string, string>[] = [];
  public parameters: Record<string, MultipleSimulatorsAlgorithmParameter> = {};
  public compatibleSimulators: CompatibleSimulator[] = [];

  public setup(
    modelFormat: string,
    frameworkId: string,
    algorithmId: string,
    parameters: Record<string, MultipleSimulatorsAlgorithmParameter>,
    simulators: Record<string, SimulatorSpecs>,
    algorithmSubstitutions: AlgorithmSubstitution[],
  ): void {
    this.compatibleSimulators = GatherCompatibleSimulators(
      modelFormat,
      frameworkId,
      algorithmId,
      parameters,
      simulators,
      algorithmSubstitutions,
    );
    this.populateParameterRows(parameters);
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const parameters = formStepData.algorithmParameters as Record<string, MultipleSimulatorsAlgorithmParameter>;
    if (!parameters) {
      return;
    }
    this.populateParameterRows(parameters);
    UpdateParameterCompatibility(this.compatibleSimulators, parameters);
  }

  public getFormStepData(): FormStepData {
    return {
      algorithmParameters: this.parameters,
    };
  }

  public parameterChanged(paramId: string, event: string): void {
    const parameter = this.parameters[paramId];
    if (!parameter) {
      return;
    }
    const hadValue = parameter.newValue && parameter.newValue.length > 0;
    const hasValue = event && event.length > 0;
    parameter.newValue = event;
    if (hadValue !== hasValue) {
      UpdateParameterCompatibility(this.compatibleSimulators, this.parameters);
    }
  }

  private populateParameterRows(parameters: Record<string, MultipleSimulatorsAlgorithmParameter>): void {
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
}
