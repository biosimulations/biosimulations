import {
  CombineArchive,
  CombineArchiveTypeEnum,
  CombineArchiveContentTypeEnum,
  CombineArchiveContentFileTypeEnum,
  CombineArchiveContentUrlTypeEnum,
  CombineArchiveLocationValue,
  CombineArchiveLocationTypeEnum,
  SedDocument,
  SedDocumentTypeEnum,
  SedModel,
  SedModelTypeEnum,
  SedModelChange,
  SedAlgorithm,
  SedAlgorithmTypeEnum,
  SedAlgorithmParameterChange,
  SedAlgorithmParameterChangeTypeEnum,
  SedSimulation,
  SedSteadyStateSimulationTypeEnum,
  SedUniformTimeCourseSimulationTypeEnum,
  SedTask,
  SedTaskTypeEnum,
  SedDataSet,
  SedDataSetTypeEnum,
  SedDataGenerator,
  SedDataGeneratorTypeEnum,
  SedModelAttributeChangeTypeEnum,
  Namespace,
  SedOutput,
  SedReport,
  SedReportTypeEnum,
  SedVariable,
  SedUniformTimeCourseSimulation,
} from '@biosimulations/combine-api-angular-client';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { SimulationType, ValueType } from '@biosimulations/datamodel/common';
import {
  AlgorithmParameter,
  SimulatorsData,
  SimulatorSpecs,
  ModelingFrameworksAlgorithmsForModelFormat as CompatibilityData,
} from '../../index';

export interface MultipleSimulatorsAlgorithmParameter {
  parameter: AlgorithmParameter;
  simulators: Set<string>;
  multipleType: boolean;
  multipleValue: boolean;
  multipleRecommendedRange: boolean;
  newValue: string | undefined;
}

export type AlgorithmParameterMap = { [id: string]: MultipleSimulatorsAlgorithmParameter };
type ParameterMapsByAlgorithmId = { [id: string]: AlgorithmParameterMap };
type ParameterMapsBySimulationId = { [id in SimulationType]?: ParameterMapsByAlgorithmId };
export type FrameworkCompatibilityMap = { [id: string]: ParameterMapsBySimulationId };

export interface ArchiveCreationData {
  modelFormat: string;
  modelUrl: string;
  modelFile: File;
  algorithmId: string;
  algorithmParameters?: AlgorithmParameterMap;
  simulationType: SimulationType;
  initialTime?: number;
  outputStartTime?: number;
  outputEndTime?: number;
  numberOfSteps?: number;
  namespaces: Namespace[];
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
}

export interface ArchiveCreationSedDocumentData {
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation;
  namespaces: Namespace[];
}

export class ArchiveCreationUtility {
  public static SUPPORTED_SIMULATION_TYPES: SimulationType[] = [
    SimulationType.SedSteadyStateSimulation,
    SimulationType.SedUniformTimeCourseSimulation,
  ];

  public static createArchive(creationData: ArchiveCreationData): CombineArchive {
    const model = this.createSedModel(creationData.modelFormat, creationData.modelChanges);
    const algorithm = this.createSedAlgorithm(creationData.algorithmId, creationData.algorithmParameters);
    const simulation = this.createSedSimulation(creationData, algorithm);
    const task = this.createSedTask(model, simulation);
    const dataSetGenerators = this.createSedDataSetAndGenerators(creationData.modelVariables, task);
    const dataSets = dataSetGenerators[0];
    const dataGenerators = dataSetGenerators[1];
    const sedDoc = this.createSedDocument(model, simulation, task, dataGenerators, dataSets);
    const modelContent = this.createArchiveLocationValue(creationData.modelFile, creationData.modelUrl);
    return this.completeArchive(creationData.modelFormat, sedDoc, modelContent, model.source);
  }

  public static createArchiveCreationSedDocumentData(
    sedDoc: SedDocument,
    simulationType: SimulationType,
  ): ArchiveCreationSedDocumentData {
    const namespaces: Namespace[] = [];
    const modelChanges = this.gatherModelChanges(sedDoc, namespaces);
    const modelVariables = this.gatherModelVariables(sedDoc, namespaces);
    const uniformTimeCourseSimulation = this.gatherTimeCourseData(sedDoc, simulationType);
    namespaces.sort((a, b): number => {
      return (a.prefix || '').localeCompare(b.prefix || '', undefined, {
        numeric: true,
      });
    });
    return {
      modelChanges: modelChanges,
      modelVariables: modelVariables,
      uniformTimeCourseSimulation: uniformTimeCourseSimulation,
      namespaces: namespaces,
    };
  }

  public static createCompatibilityMap(
    simulatorsData: SimulatorsData,
    modelFormatId: string,
  ): FrameworkCompatibilityMap {
    const compatibilityMap = {};
    const addCompatibilityForSimulator = (simulator: SimulatorSpecs): void => {
      simulator.modelingFrameworksAlgorithmsForModelFormats.forEach((compatData: CompatibilityData): void => {
        this.addCompatibility(simulatorsData, simulator.id, compatData, modelFormatId, compatibilityMap);
      });
    };
    const simulators = Object.values(simulatorsData.simulatorSpecs);
    simulators?.forEach(addCompatibilityForSimulator);
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
  private static addCompatibility(
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
      const simTypeData = ArchiveCreationUtility.SUPPORTED_SIMULATION_TYPES.find(simCompare);
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
              parameterData = {
                parameter: param,
                multipleType: false,
                multipleValue: false,
                multipleRecommendedRange: false,
                simulators: new Set<string>(simulatorId),
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

  private static createSedModel(modelFormat: string, modelChanges: SedModelChange[]): SedModel {
    const language = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat]?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
    const fileExtensions = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].fileExtensions?.[0];
    return {
      _type: SedModelTypeEnum.SedModel,
      id: 'model',
      language: language || '',
      source: 'model.' + fileExtensions,
      changes: modelChanges,
    };
  }

  private static createSedAlgorithm(
    algorithmId: string,
    algorithmParameters: AlgorithmParameterMap | undefined,
  ): SedAlgorithm {
    let algorithmChanges: SedAlgorithmParameterChange[];
    if (algorithmParameters) {
      const algorithmParamIds = Object.keys(algorithmParameters);
      const changedAlgorithmParamIds = algorithmParamIds.filter((id: string): boolean => {
        return algorithmParameters !== undefined && algorithmParameters[id].newValue !== undefined;
      });
      algorithmChanges = changedAlgorithmParamIds.map((id: string): SedAlgorithmParameterChange => {
        const paramData = algorithmParameters[id];
        const parameter = paramData.parameter;
        let newValue = paramData.newValue as string;
        if (parameter.type === ValueType.kisaoId && parameter.recommendedRange && !paramData.multipleRecommendedRange) {
          const iValue = parameter.formattedRecommendedRange.indexOf(newValue);
          newValue = parameter.recommendedRange[iValue];
        }
        return {
          _type: SedAlgorithmParameterChangeTypeEnum.SedAlgorithmParameterChange,
          kisaoId: parameter.id,
          newValue: newValue,
        };
        0;
      });
    } else {
      algorithmChanges = [];
    }
    return {
      _type: SedAlgorithmTypeEnum.SedAlgorithm,
      kisaoId: algorithmId,
      changes: algorithmChanges,
    };
  }

  private static createSedSimulation(creationData: ArchiveCreationData, algorithm: SedAlgorithm): SedSimulation {
    const simulationType = creationData.simulationType;
    if (simulationType === SimulationType.SedSteadyStateSimulation) {
      return {
        _type: SedSteadyStateSimulationTypeEnum.SedSteadyStateSimulation,
        id: 'simulation',
        algorithm: algorithm,
      };
    } else {
      return {
        _type: SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation,
        id: 'simulation',
        initialTime: creationData.initialTime as number,
        outputStartTime: creationData.outputStartTime as number,
        outputEndTime: creationData.outputEndTime as number,
        numberOfSteps: creationData.numberOfSteps as number,
        algorithm: algorithm,
      };
    }
  }

  private static createSedTask(model: SedModel, simulation: SedSimulation): SedTask {
    return {
      _type: SedTaskTypeEnum.SedTask,
      id: 'task',
      model: model.id,
      simulation: simulation.id,
    };
  }

  private static createSedDataSetAndGenerators(
    modelVariables: SedVariable[],
    task: SedTask,
  ): [SedDataSet[], SedDataGenerator[]] {
    const dataGenerators: SedDataGenerator[] = [];
    const dataSets: SedDataSet[] = [];

    modelVariables.forEach((variable: SedVariable): void => {
      const rawId = variable.id;
      variable.id = 'variable_' + variable.id;
      variable.task = task.id;

      const dataGen: SedDataGenerator = {
        _type: SedDataGeneratorTypeEnum.SedDataGenerator,
        id: 'data_generator_' + variable.id,
        parameters: [],
        variables: [variable],
        math: variable.id,
        name: variable.name,
      };
      dataGenerators.push(dataGen);

      const dataSet: SedDataSet = {
        _type: SedDataSetTypeEnum.SedDataSet,
        id: rawId,
        label: variable.name || rawId,
        dataGenerator: dataGen.id,
        name: variable.name,
      };
      dataSets.push(dataSet);
    });

    return [dataSets, dataGenerators];
  }

  private static createSedDocument(
    model: SedModel,
    simulation: SedSimulation,
    task: SedTask,
    dataGenerators: SedDataGenerator[],
    dataSets: SedDataSet[],
  ): SedDocument {
    return {
      _type: SedDocumentTypeEnum.SedDocument,
      level: 1,
      version: 3,
      styles: [],
      models: [model],
      simulations: [simulation],
      tasks: [task],
      dataGenerators: dataGenerators,
      outputs: [
        {
          _type: SedReportTypeEnum.SedReport,
          id: 'report',
          dataSets: dataSets,
        },
      ],
    };
  }

  private static createArchiveLocationValue(modelFile: File, modelUrl: string): CombineArchiveLocationValue {
    if (modelFile) {
      return {
        _type: CombineArchiveContentFileTypeEnum.CombineArchiveContentFile,
        filename: modelFile.name,
      };
    }
    return {
      _type: CombineArchiveContentUrlTypeEnum.CombineArchiveContentUrl,
      url: modelUrl,
    };
  }

  private static completeArchive(
    modelFormat: string,
    sedDoc: SedDocument,
    locationValue: CombineArchiveLocationValue,
    modelPath: string,
  ): CombineArchive {
    const formatUri = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].biosimulationsMetadata?.omexManifestUris[0];
    return {
      _type: CombineArchiveTypeEnum.CombineArchive,
      contents: [
        {
          _type: CombineArchiveContentTypeEnum.CombineArchiveContent,
          format: formatUri as string,
          master: false,
          location: {
            _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
            path: modelPath,
            value: locationValue,
          },
        },
        {
          _type: CombineArchiveContentTypeEnum.CombineArchiveContent,
          format: 'http://identifiers.org/combine.specifications/sed-ml',
          master: true,
          location: {
            _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
            path: 'simulation.sedml',
            value: sedDoc,
          },
        },
      ],
    };
  }

  private static gatherModelVariables(sedDoc: SedDocument, namespaces: Namespace[]): SedVariable[] {
    const sedReports = sedDoc.outputs?.filter((output: SedOutput): boolean => {
      return output._type === SedReportTypeEnum.SedReport;
    }) as SedReport[];
    const firstReport = sedReports?.[0];
    if (!firstReport || !firstReport.dataSets) {
      return [];
    }
    const modelVariables: SedVariable[] = [];
    const dataGeneratorsMap: { [id: string]: SedDataGenerator } = {};
    sedDoc.dataGenerators?.forEach((dataGenerator: SedDataGenerator): void => {
      dataGeneratorsMap[dataGenerator.id] = dataGenerator;
    });
    firstReport.dataSets.forEach((dataSet: SedDataSet): void => {
      const modelVar: SedVariable = dataGeneratorsMap[dataSet.dataGenerator].variables[0];
      if (!modelVar) {
        return;
      }
      modelVariables.push(modelVar);
      this.addUniqueNamespaces(modelVar.target?.namespaces, namespaces);
    });
    return modelVariables;
  }

  private static gatherModelChanges(sedDoc: SedDocument, namespaces: Namespace[]): SedModelChange[] {
    const changes = sedDoc?.models?.[0]?.changes;
    if (!changes) {
      return [];
    }
    const changeValues: SedModelChange[] = [];
    changes.forEach((change: SedModelChange): void => {
      // TODO: extend to other types of changes
      if (change._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
        return;
      }
      changeValues.push(change);
      this.addUniqueNamespaces(change.target?.namespaces, namespaces);
    });
    changeValues.sort((a, b): number => {
      const aId = a.id || '';
      const bId = b.id || '';
      return aId.localeCompare(bId, undefined, { numeric: true });
    });
    return changeValues;
  }

  private static gatherTimeCourseData(
    sedDoc: SedDocument,
    simType: SimulationType,
  ): SedUniformTimeCourseSimulation | undefined {
    const simulation = sedDoc?.simulations?.[0];
    const selectedType = simType !== SimulationType.SedUniformTimeCourseSimulation;
    const docType = simulation?._type === SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation;
    if (!selectedType || !docType) {
      return undefined;
    }
    return simulation as SedUniformTimeCourseSimulation;
  }

  private static addUniqueNamespaces(newNamespaces: Namespace[] | undefined, existingNamespaces: Namespace[]): void {
    if (!newNamespaces) {
      return;
    }
    newNamespaces.forEach((newNamespace: Namespace): void => {
      const alreadyAdded =
        existingNamespaces.find((namespace: Namespace): boolean => {
          return newNamespace.prefix === namespace.prefix;
        }) !== undefined;
      if (!alreadyAdded) {
        existingNamespaces.push(newNamespace);
      }
    });
  }
}
