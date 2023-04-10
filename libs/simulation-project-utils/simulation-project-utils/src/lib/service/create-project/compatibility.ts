import {
  AlgorithmSubstitutionPolicyLevels,
  ALGORITHM_SUBSTITUTION_POLICIES,
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
  SimulationType,
} from '@biosimulations/datamodel/common';
import {
  AlgorithmParameter,
  SimulatorsData,
  SimulatorSpecs,
  ModelingFrameworksAlgorithmsForModelFormat as CompatibilityData,
  OntologyTerm,
} from '../dispatch/dispatch.service';
import { AppRoutes } from '@biosimulations/config/common';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';

/**
 * Gathers a list of formats that are compatible with at least one of the provided simulators and for which
 * introspection is available.
 *
 * @param simulators The available simulators.
 * @param formats The available formats.
 */
export function GatherCompatibleFormats(
  simulators: Record<string, SimulatorSpecs>,
  formats: Record<string, OntologyTerm>,
): OntologyTerm[] {
  // Find all formats supported by available simulators
  const formatEdamIds = new Set<string>();
  const addIdToSet = (formatEdamId: string): void => {
    formatEdamIds.add(formatEdamId);
  };
  const addIdsFromCompatibilityData = (frameworksAlgorithms: CompatibilityData): void => {
    frameworksAlgorithms.formatEdamIds.forEach(addIdToSet);
  };
  const addIdsFromSimulator = (simulator: SimulatorSpecs): void => {
    simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(addIdsFromCompatibilityData);
  };
  const simulatorSpecs = Object.values(simulators);
  simulatorSpecs.forEach(addIdsFromSimulator);

  // Filter formats by available and introspectable model formats.
  let modelFormats: OntologyTerm[] = Object.values(formats);
  modelFormats = modelFormats.filter((format: OntologyTerm): boolean => {
    const formatAvailable = formatEdamIds.has(format.id);
    const formatMetadata = BIOSIMULATIONS_FORMATS_BY_ID[format.id]?.biosimulationsMetadata?.modelFormatMetadata;
    return formatAvailable && formatMetadata?.introspectionAvailable === true;
  });
  modelFormats.sort((a: OntologyTerm, b: OntologyTerm): number => {
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
  return modelFormats;
}

/**
 * Contains data representing a simulator, the minimum algorithm substitution policy for which it is compatible
 * with a model, framework, and algorithm, and whether it is also compatible with a set of algorithm parameters.
 */
export interface CompatibleSimulator {
  simulator: {
    id: string;
    name: string;
    url: string;
  };
  minPolicy: AlgorithmSubstitutionPolicy;
  parametersCompatibility: boolean;
}

/**
 * Returns a list of CompatibleSimulator instances that represent all simulators that are compatible with the provided
 * frameworkId, modelFormat, and either the algorithm or an algorithm that is substitutable for it by the policies provided
 * in algorithmSubstitutions. Each CompatibleSimulator instance's parametersCompatibility is updated to match the simulators
 * compatibility with the provided parameters.
 *
 * @param modelFormat The model format that all returned CompatibleSimulator will be compatible with.
 * @param frameworkId The framework that all returned CompatibleSimulators will be compatible with.
 * @param algorithmId The algorithm that all returned CompatibleSimulators will be compatible with (or its substitutions).
 * @param parameters The parameters whose compatibility is referenced in each CompatibleSimulator's parametersCompatibility.
 * @param simulators The available simulators to choose CompatibleSimulators from
 * @param algorithmSubstitutions A list of algorithm substitutions.
 * @returns A list of CompatibleSimulator instances representing all compatible simulators
 */
export function GatherCompatibleSimulators(
  modelFormat: string,
  frameworkId: string,
  algorithmId: string,
  parameters: Record<string, MultipleSimulatorsAlgorithmParameter>,
  simulators: Record<string, SimulatorSpecs>,
  algorithmSubstitutions: AlgorithmSubstitution[],
): CompatibleSimulator[] {
  const algSubstitutionsMap = CreateAlgorithmSubstitutionsMap(algorithmSubstitutions);
  const compatibleAlgIds = CreateAlgorithmCompatibilityMap(simulators, modelFormat, frameworkId);
  const compatibleSimulators = CreateCompatibleSimulators(
    simulators,
    compatibleAlgIds,
    algorithmId,
    algSubstitutionsMap,
  );
  compatibleSimulators.sort((a: CompatibleSimulator, b: CompatibleSimulator): number => {
    return a.simulator.name.localeCompare(b.simulator.name, undefined, { numeric: true });
  });
  UpdateParameterCompatibility(compatibleSimulators, parameters);
  return compatibleSimulators;
}

/**
 * Updates the parametersCompatibility property of each CompatibleSimulator based on its compatibility with the parameters
 * within parameters.
 *
 * @param parameters A map of parameters that will be checked for compatibility with the CompatibleSimulators
 * @param compatibleSimulators A list of CompatibleSimulators whose parameterCompatibility will be updated.
 */
export function UpdateParameterCompatibility(
  compatibleSimulators: CompatibleSimulator[],
  parameters: Record<string, MultipleSimulatorsAlgorithmParameter>,
): void {
  if (!parameters) {
    return;
  }
  compatibleSimulators.forEach((compatibleSimulator: CompatibleSimulator): void => {
    compatibleSimulator.parametersCompatibility = true;
  });
  Object.keys(parameters).forEach((paramId: string): void => {
    const param = parameters[paramId];
    if (!param.newValue || param.newValue.length === 0) {
      return;
    }
    compatibleSimulators.forEach((compatibleSimulator: CompatibleSimulator): void => {
      const paramHasSimulator = param.simulators.has(compatibleSimulator.simulator.id);
      const strictPolicy = compatibleSimulator.minPolicy.level < AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK;
      if (!paramHasSimulator && strictPolicy) {
        compatibleSimulator.parametersCompatibility = false;
      }
    });
  });
}

/**
 * Converts a list of AlgorithmSubstitutions into a map of AlgorithmSubstitutionPolicy instances keyed by a concatenation of
 * the ids of the algorithms that can be substituted. Filters out substitutions whose policy is > SAME_FRAMEWORK.
 *
 * @param substitutions The list of substitutions to convert.
 * @returns The substitutions in map form.
 */
function CreateAlgorithmSubstitutionsMap(
  substitutions: AlgorithmSubstitution[],
): Record<string, AlgorithmSubstitutionPolicy> {
  const algSubstitutionsMap: Record<string, AlgorithmSubstitutionPolicy> = {};
  const filteredSubstitutions = substitutions.filter(
    (sub) => sub.minPolicy.level <= AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK,
  );
  filteredSubstitutions.forEach((algSubstitution: AlgorithmSubstitution): void => {
    const combinedIds: string = algSubstitution.algorithms[0].id + '/' + algSubstitution.algorithms[1].id;
    algSubstitutionsMap[combinedIds] = algSubstitution.minPolicy;
  });
  return algSubstitutionsMap;
}

/**
 * Creates a map of algorithm ids keyed by simulators, representing the set of algorithms that are compatible with the
 * simulator, the chosen format, and the chosen framework.
 *
 * @param formatId The format the simulation tools and algorithms must be compatible with.
 * @param frameworkId The framework the simulation tools and algorithms must be compataible with.
 * @param simulators Specs of all the simulation tools available.
 * @returns Compatible algorithms keyed by simulator ids.
 */
function CreateAlgorithmCompatibilityMap(
  simulators: Record<string, SimulatorSpecs>,
  formatId: string,
  frameworkId: string,
): Record<string, string[]> {
  const compatibleAlgorithms: Record<string, string[]> = {};
  const isCompatible = (compatabilityData: CompatibilityData): boolean => {
    const formatCompatible = compatabilityData.formatEdamIds.includes(formatId);
    const frameworkCompatible = compatabilityData.frameworkSboIds.includes(frameworkId);
    return formatCompatible && frameworkCompatible;
  };
  const setCompatibleAlgorithms = (simulator: SimulatorSpecs): void => {
    const compatData = simulator.modelingFrameworksAlgorithmsForModelFormats.filter(isCompatible);
    compatibleAlgorithms[simulator.id] = compatData.flatMap((compatData: CompatibilityData): string[] => {
      return compatData.algorithmKisaoIds;
    });
  };
  Object.values(simulators).forEach(setCompatibleAlgorithms);
  return compatibleAlgorithms;
}

/**
 * Creates a list of CompatibleSimulator instances. Each compatible simulator represents a simulator that is compatible
 * with the chosen algorithm, either directly or by being compatible with an algorithm that the chosen algorithm can be
 * substituted for.
 *
 * @param simulators A map of the available simulators.
 * @param compatibleAlgorithms A map of sets of algorithms keyed by a simulator they are compatible with.
 * @param chosenAlgorithm The selected algorithm.
 * @param algorithmSubstitutions A map of potential algorithm substitutions.
 * @returns A list of CompatibleSimulator instances.
 */
function CreateCompatibleSimulators(
  simulators: Record<string, SimulatorSpecs>,
  compatibleAlgorithms: Record<string, string[]>,
  chosenAlgorithm: string,
  algorithmSubstitutions: Record<string, AlgorithmSubstitutionPolicy>,
): CompatibleSimulator[] {
  const compatibleSimulators: Record<string, CompatibleSimulator> = {};
  Object.entries(compatibleAlgorithms).forEach(([simulatorId, algorithms]: [string, string[]]): void => {
    algorithms.forEach((algorithmId: string): void => {
      UpdateCompatibleSimulators(
        simulators,
        compatibleSimulators,
        chosenAlgorithm,
        algorithmSubstitutions,
        simulatorId,
        algorithmId,
      );
    });
  });
  return Object.values(compatibleSimulators);
}

/**
 * Updates a running map of CompatibleSimulator instances for a given simulator and algorithm that it is directly
 * compatible with. If the algorithm matches the chosen algorithm then a CompatibleSimulator instance with be added with
 * the SAME_METHOD policy. If the algorithm is substitutable for the chosen algorithm with a policy lower than the current
 * min policy on the CompatibleSimulator (or no matching CompatibleSimulator yet exists) a CompatibleSimulator will be set
 * for this simulator id with a minPolicy matching the substitution policy for algorithmId and chosenAlgorithm. If
 * algorithmID and chosenAlgorithm are not substitutable then nothing will be added or updated.
 *
 * @param simulators A map of the available simulators.
 * @param compatibleSimulators The map of exising CompatibleSimulator instances that this function updates.
 * @param chosenAlgorithm The selected algorithm.
 * @param algorithmSubstitutions A map of potential algorithm substitutions
 * @param simulatorId The id of the simulator whose compatibility should be updated.
 * @param algorithmId An algorithm that is compatible the provided simulatorId.
 */
function UpdateCompatibleSimulators(
  simulators: Record<string, SimulatorSpecs>,
  compatibleSimulators: Record<string, CompatibleSimulator>,
  chosenAlgorithm: string,
  algorithmSubstitutions: Record<string, AlgorithmSubstitutionPolicy>,
  simulatorId: string,
  algorithmId: string,
): void {
  if (chosenAlgorithm === algorithmId) {
    const policy = ALGORITHM_SUBSTITUTION_POLICIES[AlgorithmSubstitutionPolicyLevels.SAME_METHOD];
    compatibleSimulators[simulatorId] = CreateCompatibleSimulator(simulators, simulatorId, policy);
    return;
  }
  const policy = algorithmSubstitutions[algorithmId + '/' + chosenAlgorithm];
  if (!policy) {
    return;
  }
  const existingCompatibility = compatibleSimulators[simulatorId];
  if (!existingCompatibility) {
    compatibleSimulators[simulatorId] = CreateCompatibleSimulator(simulators, simulatorId, policy);
  } else if (policy.level < compatibleSimulators[simulatorId].minPolicy.level) {
    compatibleSimulators[simulatorId].minPolicy = policy;
  }
}

/**
 * Creates a CompatibleSimulator instance.
 *
 * @param simulators A map of available simulators.
 * @param simulatorId The id of the new compatible simulator.
 * @param minPolicy The min policy of the new CompatibleSimulator
 * @returns a new CompatibleSimulator instance
 */
function CreateCompatibleSimulator(
  simulators: Record<string, SimulatorSpecs>,
  simulatorId: string,
  minPolicy: AlgorithmSubstitutionPolicy,
): CompatibleSimulator {
  const appRoutes = new AppRoutes();
  return {
    minPolicy: minPolicy,
    parametersCompatibility: true,
    simulator: {
      id: simulatorId,
      name: simulators[simulatorId]?.name as string,
      url: appRoutes.getSimulatorsView(simulatorId),
    },
  };
}

export interface MultipleSimulatorsAlgorithmParameter {
  parameter: AlgorithmParameter;
  simulators: Set<string>;
  multipleType: boolean;
  multipleValue: boolean;
  multipleRecommendedRange: boolean;
  newValue: string | undefined;
}

export type FrameworkCompatibilityMap = {
  [frameworkId: string]: {
    [simulationType in SimulationType]?: {
      [algorithmId: string]: Record<string, MultipleSimulatorsAlgorithmParameter>;
    };
  };
};

export const SUPPORTED_SIMULATION_TYPES: SimulationType[] = [
  SimulationType.SedSteadyStateSimulation,
  SimulationType.SedUniformTimeCourseSimulation,
];

export function CreateCompatibilityMap(
  simulatorsData: SimulatorsData,
  modelFormatId: string,
): FrameworkCompatibilityMap {
  const compatibilityMap = {};
  const addCompatibilityForSimulator = (simulator: SimulatorSpecs): void => {
    simulator.modelingFrameworksAlgorithmsForModelFormats.forEach((compatData: CompatibilityData): void => {
      AddCompatibility(simulatorsData, simulator.id, compatData, modelFormatId, compatibilityMap);
    });
  };
  Object.values(simulatorsData.simulatorSpecs).forEach(addCompatibilityForSimulator);
  return compatibilityMap;
}

/*
  Generates a nested map containing compatibility data between frameworks, simulation types, and algorithms,
  as well as their parameters.

  A framework is compatible and will be a key at the root level of compatibilityMap if it:
  1. Exists within simData.modelingFrameworks.
  2. There is a simulator with a ModelingFrameworksAlgorithmsForModelFormat instance that contains both
     that framework and the chosen model format.
  3. There is at least one simulation type and algorithm compatible with this framework.

  Simulation types are keyed under each framework they are compatible with. One is compatible if it:
  1. Exists within ALL_SIMULATION_TYPES
  2. There is a simulator with a ModelingFrameworksAlgorithmsForModelformat instance that contains the
     chosen model format, the framework in question, and the simulation type.
  3. There is at least one algorithm compatible with the framework and simulation type.

  Algorithms are keyed under each simulation type and framework they are compatible with. One is compatible if it:
  1. Exists within simData.simulationAlgorithms.
  2. There is a simulator with a ModelingFrameworksAlgorithmsForModelformat instance that contains the
     chosen model format, the framework in question, the simulation type in question, and the algorithm.

  AlgorithmParameterData keyed under each parameter, algorithm, simulation type, and framework id for
  which it applies.
  */
function AddCompatibility(
  simData: SimulatorsData,
  simulatorId: string,
  compatData: CompatibilityData,
  modelFormatId: string,
  compatibilityMap: FrameworkCompatibilityMap,
): void {
  const compatibleWithModelFormat = compatData.formatEdamIds.includes(modelFormatId);
  if (!compatibleWithModelFormat) {
    return;
  }
  // Filter frameworks, simulation types, and algorithms down to those that meet the compatibility conditions.
  let frameworkIds = compatData.frameworkSboIds;
  frameworkIds = frameworkIds.filter((frameworkId: string): boolean => {
    return simData.modelingFrameworks[frameworkId] !== undefined;
  });
  let simulationTypes = compatData.simulationTypes;
  simulationTypes = simulationTypes.filter((simulationType: SimulationType): boolean => {
    const simCompare = (supportedType: SimulationType): boolean => {
      return supportedType === simulationType;
    };
    const simTypeData = SUPPORTED_SIMULATION_TYPES.find(simCompare);
    return simTypeData !== undefined;
  });
  let algorithms = compatData.algorithmKisaoIds;
  algorithms = algorithms.filter((algorithmId: string): boolean => {
    return simData.simulationAlgorithms[algorithmId] !== undefined;
  });
  const parameters = compatData.parameters;

  // This looks like problematic time/space complexity, but simulationTypes and algorithms are bounded to
  // constant length, so it shouldn't be too bad.
  frameworkIds.forEach((frameworkId: string): void => {
    simulationTypes.forEach((simulationType: SimulationType): void => {
      algorithms.forEach((algorithmId: string): void => {
        const mapForFrameworkId = compatibilityMap[frameworkId] || {};
        const mapForSimulationType = mapForFrameworkId[simulationType] || {};
        const mapForAlgorithm = mapForSimulationType[algorithmId] || {};
        parameters.forEach((param: AlgorithmParameter): void => {
          let parameterData = mapForAlgorithm[param.id];
          const oldParam = parameterData?.parameter;
          if (oldParam) {
            parameterData.simulators.add(simulatorId);
            const typeConflict = oldParam.type !== param.type;
            const valueConflict = oldParam.formattedValue !== param.formattedValue;
            const rangeConflict = oldParam.formattedRecommendedRangeJoined !== param.formattedRecommendedRangeJoined;
            parameterData.multipleType ||= typeConflict;
            parameterData.multipleValue ||= valueConflict;
            parameterData.multipleRecommendedRange ||= rangeConflict;
          } else {
            const simulators = new Set<string>();
            simulators.add(simulatorId);
            parameterData = {
              parameter: param,
              multipleType: false,
              multipleValue: false,
              multipleRecommendedRange: false,
              simulators: simulators,
              newValue: undefined,
            };
          }
          mapForAlgorithm[param.id] = parameterData;
        });
        mapForSimulationType[algorithmId] = mapForAlgorithm;
        mapForFrameworkId[simulationType] = mapForSimulationType;
        compatibilityMap[frameworkId] = mapForFrameworkId;
      });
    });
  });
}
