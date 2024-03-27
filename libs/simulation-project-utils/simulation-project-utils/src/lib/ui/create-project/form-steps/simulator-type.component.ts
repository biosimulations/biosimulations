import { Component } from '@angular/core';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import {
  OntologyTerm,
  SimulatorsData,
  OntologyTermsMap,
  FrameworkCompatibilityMap,
  CreateCompatibilityMap,
} from '../../../../index';
import { SimulationType, SimulationTypeBriefName } from '@biosimulations/datamodel/common';

@Component({
  selector: 'create-project-simulator-type',
  templateUrl: './simulator-type.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class SimulatorTypeComponent implements IFormStepComponent {
  public nextClicked = false;
  public formGroup: UntypedFormGroup;
  public compatibleFrameworks: OntologyTerm[] = [];
  public compatibleSimulationTypes: SimulationType[] = [];
  public compatibleAlgorithms: OntologyTerm[] = [];

  private allAlgorithms: OntologyTermsMap = {};
  private compatibilityMap: FrameworkCompatibilityMap = {};

  public constructor(private formBuilder: UntypedFormBuilder) {
    this.formGroup = this.formBuilder.group({
      framework: [null, Validators.required],
      simulationType: [null, Validators.required],
      algorithm: [null, Validators.required],
    });
    this.formGroup.controls.simulationType?.disable();
    this.formGroup.controls.algorithm?.disable();
  }

  public getSimulationTypeName(simulationType: SimulationType): SimulationTypeBriefName {
    switch (simulationType) {
      case SimulationType.SedSteadyStateSimulation:
        return SimulationTypeBriefName.SedSteadyStateSimulation;
      case SimulationType.SedOneStepSimulation:
        return SimulationTypeBriefName.SedOneStepSimulation;
      case SimulationType.SedUniformTimeCourseSimulation:
        return SimulationTypeBriefName.SedUniformTimeCourseSimulation;
    }
  }

  public setup(simulatorsData: SimulatorsData | undefined, modelFormatId: string | undefined): void {
    if (!simulatorsData || !modelFormatId) {
      return;
    }
    this.allAlgorithms = simulatorsData.simulationAlgorithms;
    this.compatibilityMap = CreateCompatibilityMap(simulatorsData, modelFormatId);
    this.updateCompatibleFrameworks(simulatorsData);
    if (this.compatibleFrameworks?.length === 1) {
      this.formGroup.controls.framework.setValue(this.compatibleFrameworks[0].id);
      this.updateDropdowns();
    }
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const frameworkId = formStepData.framework as string;
    const simulationType = formStepData.simulationType as SimulationType;
    const algorithmId = formStepData.algorithm as string;
    if (!this.isFrameworkCompatible(frameworkId)) {
      return;
    }
    this.formGroup.controls.framework.setValue(frameworkId);
    this.updateCompatibleSimulations(frameworkId);
    if (!this.isSimulationTypeCompatible(simulationType)) {
      return;
    }
    this.formGroup.controls.simulationType.setValue(simulationType);
    this.formGroup.controls.simulationType.enable();
    this.updateCompatibleAlgorithms(frameworkId, simulationType);
    if (!this.isAlgorithmCompatible(algorithmId)) {
      return;
    }
    this.formGroup.controls.algorithm.setValue(algorithmId);
    this.formGroup.controls.algorithm.enable();
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }

    const frameworkId = this.formGroup.value.framework;
    const simulationType = this.formGroup.value.simulationType as SimulationType;
    const algorithmId = this.formGroup.value.algorithm;
    console.log(`${frameworkId}, ${simulationType}, ${algorithmId}`);
    return {
      framework: frameworkId,
      simulationType: simulationType,
      algorithm: algorithmId,
      parameters: this.compatibilityMap[frameworkId]?.[simulationType]?.[algorithmId],
    };
  }

  public updateDropdowns(): void {
    this.updateSimulationTypesDropdown();
    this.updateAlgorithmsDropdown();
  }

  private updateCompatibleFrameworks(simulatorsData: SimulatorsData): void {
    const frameworkIds = Object.keys(this.compatibilityMap);
    const frameworks = frameworkIds.map((frameworkId: string): OntologyTerm => {
      return simulatorsData.modelingFrameworks[frameworkId];
    });
    frameworks.sort((a: OntologyTerm, b: OntologyTerm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    this.compatibleFrameworks = frameworks;
  }

  private updateCompatibleSimulations(frameworkId: string): void {
    if (!frameworkId) {
      this.compatibleSimulationTypes = [];
      return;
    }
    const compatibleTypes = Object.keys(this.compatibilityMap[frameworkId]) as SimulationType[];
    compatibleTypes.sort((a: SimulationType, b: SimulationType): number => {
      const aName = this.getSimulationTypeName(a);
      const bName = this.getSimulationTypeName(b);
      return aName.localeCompare(bName, undefined, { numeric: true });
    });
    this.compatibleSimulationTypes = compatibleTypes;
  }

  private updateCompatibleAlgorithms(frameworkId: string, simulationType: SimulationType): void {
    const paramMapsByAlgorithmId = this.compatibilityMap[frameworkId][simulationType];
    if (!frameworkId || !simulationType || !paramMapsByAlgorithmId) {
      this.compatibleAlgorithms = [];
      return;
    }
    const algorithmIds = Object.keys(paramMapsByAlgorithmId);
    const algorithms: OntologyTerm[] = algorithmIds.map((algorithmId: string): OntologyTerm => {
      return this.allAlgorithms[algorithmId];
    });
    algorithms.sort((a: OntologyTerm, b: OntologyTerm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    this.compatibleAlgorithms = algorithms;
  }

  private updateSimulationTypesDropdown(): void {
    const frameworkId = this.formGroup.controls.framework.value;
    this.updateCompatibleSimulations(frameworkId);

    const currentValue = this.formGroup.controls.simulationType.value;
    let newValue: SimulationType | null = currentValue;

    const optionsAvailable = this.compatibleSimulationTypes && this.compatibleSimulationTypes?.length > 0;
    if (optionsAvailable) {
      this.formGroup.controls.simulationType.enable();
      if (this.compatibleSimulationTypes?.length === 1) {
        newValue = this.compatibleSimulationTypes[0];
      } else if (!this.isSimulationTypeCompatible(currentValue)) {
        newValue = null;
      }
    } else {
      this.formGroup.controls.simulationType.disable();
      newValue = null;
    }

    if (currentValue !== newValue) {
      this.formGroup.controls.simulationType.setValue(newValue);
    }
  }

  private updateAlgorithmsDropdown(): void {
    const frameworkId = this.formGroup.controls.framework.value;
    const simulationType: SimulationType = this.formGroup.controls.simulationType.value;
    this.updateCompatibleAlgorithms(frameworkId, simulationType);

    const currentValue = this.formGroup.controls.algorithm.value;
    let newValue: string | null = currentValue;

    const optionsAvailable = this.compatibleAlgorithms && this.compatibleAlgorithms.length > 0;
    if (optionsAvailable) {
      this.formGroup.controls.algorithm.enable();
      if (this.compatibleAlgorithms?.length === 1) {
        newValue = this.compatibleAlgorithms[0].id;
      } else if (!this.isAlgorithmCompatible(currentValue)) {
        newValue = null;
      }
    } else {
      this.formGroup.controls.algorithm.disable();
      newValue = null;
    }

    if (newValue !== currentValue) {
      this.formGroup.controls.algorithm.setValue(newValue);
    }
  }

  private isFrameworkCompatible(frameworkId: string): boolean {
    return (
      this.compatibleFrameworks.find((framework: OntologyTerm): boolean => {
        return framework.id === frameworkId;
      }) !== undefined
    );
  }

  private isSimulationTypeCompatible(simulationType: SimulationType): boolean {
    return (
      this.compatibleSimulationTypes.find((simType: SimulationType): boolean => {
        return simType === simulationType;
      }) !== undefined
    );
  }

  private isAlgorithmCompatible(algorithmId: string): boolean {
    return (
      this.compatibleAlgorithms?.find((algorithm: OntologyTerm): boolean => {
        return algorithm.id === algorithmId;
      }) !== undefined
    );
  }
}
