import { Component } from '@angular/core';
import { FormStepComponent, FormStepData } from './form-step';
import {
  AlgorithmSubstitutionPolicyLevels,
  ALGORITHM_SUBSTITUTION_POLICIES,
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
} from '@biosimulations/datamodel/common';
import {
  AlgorithmParameterMap,
  SimulatorsData,
  SimulatorSpecs,
  SimulatorSpecsMap,
  ModelingFrameworksAlgorithmsForModelFormat as CompatibilityData,
} from '@biosimulations/simulation-project-utils/service';
import { AppRoutes } from '@biosimulations/config/common';

interface Simulator {
  id: string;
  name: string;
  url: string;
}

interface CompatibleSimulator {
  simulator: Simulator;
  minPolicy: AlgorithmSubstitutionPolicy;
  parametersCompatibility: boolean;
}

interface SimulatorCompatibility {
  algorithm: AlgorithmSubstitutionPolicy;
  parameters: boolean;
}

type AlgorithmsBySimulatorId = { [id: string]: string[] };
type AlgorithmSubstitutionMap = { [id: string]: AlgorithmSubstitutionPolicy };
type SimulatorCompatibilityMap = { [id: string]: SimulatorCompatibility };

@Component({
  selector: 'create-project-simulation-tools',
  templateUrl: './simulation-tools.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class SimulationToolsComponent implements FormStepComponent {
  public nextClicked = false;
  public compatibleSimulators?: CompatibleSimulator[];

  private appRoutes = new AppRoutes();
  private simulateCallback?: () => void;
  private downloadCallback?: () => void;

  public setup(
    modelFormat: string,
    frameworkId: string,
    algorithmId: string,
    parameters: AlgorithmParameterMap,
    simulatorsData: SimulatorsData,
    algorithmSubstitutions: AlgorithmSubstitution[],
    simulateCallback: () => void,
    downloadCallback: () => void,
  ): void {
    this.simulateCallback = simulateCallback;
    this.downloadCallback = downloadCallback;
    const simulatorMap = simulatorsData.simulatorSpecs;
    const simulators = Object.values(simulatorsData.simulatorSpecs);
    simulators.sort((a: SimulatorSpecs, b: SimulatorSpecs): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    const algSubstitutionsMap = this.createAlgorithmSubstitutionsMap(algorithmSubstitutions);
    const compatibleAlgIds = this.gatherAlgorithmIds(modelFormat, frameworkId, simulators);
    const simCompatibility = this.createSimCompatibility(compatibleAlgIds, algorithmId, algSubstitutionsMap);
    this.updateSimulatorCompatibility(parameters, simCompatibility);
    this.populateCompatibleSimulators(simCompatibility, simulatorMap);
  }

  public populateFormFromFormStepData(_formStepData: FormStepData): void {
    return;
  }

  public getFormStepData(): FormStepData {
    return undefined;
  }

  public onSimulateClicked(): void {
    if (this.simulateCallback) {
      this.simulateCallback();
    }
  }

  public onDownloadClicked(): void {
    if (this.downloadCallback) {
      this.downloadCallback();
    }
  }

  private createAlgorithmSubstitutionsMap(subs: AlgorithmSubstitution[]): AlgorithmSubstitutionMap {
    const algSubstitutionsMap: { [id: string]: AlgorithmSubstitutionPolicy } = {};
    const filteredSubstitutions = subs.filter(
      (sub) => sub.minPolicy.level <= AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK,
    );
    filteredSubstitutions.forEach((algSubstitution: AlgorithmSubstitution): void => {
      const combinedIds: string = algSubstitution.algorithms[0].id + '/' + algSubstitution.algorithms[1].id;
      algSubstitutionsMap[combinedIds] = algSubstitution.minPolicy;
    });
    return algSubstitutionsMap;
  }

  private gatherAlgorithmIds(format: string, framework: string, sims: SimulatorSpecs[]): AlgorithmsBySimulatorId {
    const compatibleIds: AlgorithmsBySimulatorId = {};
    const isCompatible = (compatabilityData: CompatibilityData): boolean => {
      const formatCompatible = compatabilityData.formatEdamIds.includes(format);
      const frameworkCompatible = compatabilityData.frameworkSboIds.includes(framework);
      return formatCompatible && frameworkCompatible;
    };
    const simulatorLoop = (simulator: SimulatorSpecs): void => {
      const compatData = simulator.modelingFrameworksAlgorithmsForModelFormats.filter(isCompatible);
      compatibleIds[simulator.id] = compatData.flatMap((compatData: CompatibilityData): string[] => {
        return compatData.algorithmKisaoIds;
      });
    };
    sims.forEach(simulatorLoop);
    return compatibleIds;
  }

  private createSimCompatibility(
    simAlgs: AlgorithmsBySimulatorId,
    algorithmId: string,
    algSubs: AlgorithmSubstitutionMap,
  ): SimulatorCompatibilityMap {
    const simCompatibilities: { [id: string]: SimulatorCompatibility } = {};
    const addAlgForSim = (simulatorId: string, algId: string): void => {
      if (algId === algorithmId) {
        simCompatibilities[simulatorId] = {
          algorithm: ALGORITHM_SUBSTITUTION_POLICIES[AlgorithmSubstitutionPolicyLevels.SAME_METHOD],
          parameters: true,
        };
        return;
      }
      const policy = algSubs?.[algId + '/' + algorithmId];
      if (!policy) {
        return;
      }
      if (!(simulatorId in simCompatibilities)) {
        simCompatibilities[simulatorId] = {
          algorithm: policy,
          parameters: true,
        };
      } else if (policy.level < simCompatibilities[simulatorId].algorithm.level) {
        simCompatibilities[simulatorId].algorithm = policy;
      }
    };
    Object.entries(simAlgs).forEach(([simulatorId, algIds]: [string, string[]]): void => {
      algIds.forEach((algId: string): void => {
        addAlgForSim(simulatorId, algId);
      });
    });
    return simCompatibilities;
  }

  private updateSimulatorCompatibility(paramMap: AlgorithmParameterMap, compatMap: SimulatorCompatibilityMap): void {
    const paramIds = Object.keys(paramMap);
    paramIds.forEach((paramId: string): void => {
      const param = paramMap[paramId];
      if (!param.newValue) {
        return;
      }
      Object.entries(compatMap).forEach(([simId, compatability]: [string, SimulatorCompatibility]): void => {
        const paramHasSimulator = param.simulators.has(simId);
        const strictPolicy = compatability.algorithm.level < AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK;
        if (!paramHasSimulator && strictPolicy) {
          compatMap[simId].parameters = false;
        }
      });
    });
  }

  private populateCompatibleSimulators(simCapabilities: SimulatorCompatibilityMap, simMap: SimulatorSpecsMap): void {
    const createSimulator = ([simulatorId, compatability]: [string, SimulatorCompatibility]): CompatibleSimulator => {
      return {
        simulator: {
          id: simulatorId,
          name: simMap?.[simulatorId]?.name as string,
          url: this.appRoutes.getSimulatorsView(simulatorId),
        },
        minPolicy: compatability.algorithm,
        parametersCompatibility: compatability.parameters,
      };
    };
    this.compatibleSimulators = Object.entries(simCapabilities).map(createSimulator);
  }
}
