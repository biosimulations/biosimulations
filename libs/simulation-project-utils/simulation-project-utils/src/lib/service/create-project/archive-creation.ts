import {
  CombineArchive,
  CombineArchiveContentFileTypeEnum,
  CombineArchiveContentTypeEnum,
  CombineArchiveContentUrlTypeEnum,
  CombineArchiveLocationTypeEnum,
  CombineArchiveLocationValue,
  CombineArchiveTypeEnum,
  Namespace,
  SedAlgorithm,
  SedAlgorithmParameterChange,
  SedAlgorithmParameterChangeTypeEnum,
  SedAlgorithmTypeEnum,
  SedDataGenerator,
  SedDataGeneratorTypeEnum,
  SedDataSet,
  SedDataSetTypeEnum,
  SedDocument,
  SedDocumentTypeEnum,
  SedModel,
  SedModelAttributeChangeTypeEnum,
  SedModelChange,
  SedModelTypeEnum,
  SedReportTypeEnum,
  SedSimulation,
  SedSteadyStateSimulationTypeEnum,
  SedStyleTypeEnum,
  SedTarget,
  SedTargetTypeEnum,
  SedTask,
  SedTaskTypeEnum,
  SedUniformTimeCourseSimulationTypeEnum,
  SedVariable,
  SedVariableTypeEnum,
} from '@biosimulations/combine-api-angular-client';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { SimulationType, ValueType } from '@biosimulations/datamodel/common';
import { MultipleSimulatorsAlgorithmParameter } from './compatibility';
import { PostNewProjectSedDocument, IntrospectNewProject } from './project-introspection';
import { Endpoints } from '@biosimulations/config/common';
import FormData from 'form-data';
import { HttpClient } from '@angular/common/http';

/**
 * Builds a CombineArchive instance with the provided parameters.
 */
export function CreateArchive(
  modelFormat: string,
  modelUrl: string,
  modelFile: File,
  algorithmId: string,
  simulationType: SimulationType,
  initialTime: number,
  outputStartTime: number,
  outputEndTime: number,
  numberOfSteps: number,
  algorithmParameters: Record<string, MultipleSimulatorsAlgorithmParameter>,
  changesData: Record<string, string>[],
  variablesData: Record<string, string>[],
  namespaces: Namespace[],
  http?: HttpClient,
): CombineArchive {
  const sedChanges = CreateSedModelChanges(changesData, namespaces);
  const model = CreateSedModel(modelFormat, sedChanges, modelUrl);
  const algorithm = CreateSedAlgorithm(algorithmId, algorithmParameters);
  const simulation = CreateSedSimulation(
    simulationType,
    initialTime,
    outputStartTime,
    outputEndTime,
    numberOfSteps,
    algorithm,
  );
  const task = CreateSedTask(model, simulation);
  const sedVariables = CreateSedVariables(variablesData, namespaces);
  const dataSetGenerators = CreateSedDataSetAndGenerators(sedVariables, task);
  const dataSets = dataSetGenerators[0];
  const dataGenerators = dataSetGenerators[1];

  // below we should get the sed doc from a post new project request:
  //const sedDoc = IntrospectNewProject(http, model, simulation, )
  const sedDoc = CreateSedDocument(model, simulation, task, dataGenerators, dataSets);
  const modelContent = CreateArchiveModelLocationValue(modelFile, modelUrl);
  return CompleteArchive(modelFormat, sedDoc, modelContent, model.source);
}

function CreateSedModelChanges(modelChanges: Record<string, string>[], namespaces: Namespace[]): SedModelChange[] {
  const changes: SedModelChange[] = [];
  modelChanges.forEach((changeData: Record<string, string>, i: number): void => {
    if (!changeData.newValue || changeData.newValue.length === 0) {
      console.log(`***********${i}: no change available!`);
      //return;
    }
    console.log(`the change type: ${changeData._type}`);
    changes.push({
      _type: SedModelAttributeChangeTypeEnum.SedModelAttributeChange,
      id: changeData.id,
      name: changeData.name,
      newValue: changeData.newValue,
      target: {
        _type: SedTargetTypeEnum.SedTarget,
        namespaces: namespaces,
        value: changeData.target,
      },
    });
  });
  if (changes.length) {
    console.log(`----- changes: ${changes.length}`);
  }
  return changes;
}

function CreateSedVariables(modelVariables: Record<string, string>[], namespaces: Namespace[]): SedVariable[] {
  const variables: SedVariable[] = [];
  modelVariables.forEach((variableData: Record<string, string>): void => {
    const symbolType = variableData.type === 'symbol';
    let target: SedTarget | undefined = undefined;
    if (!symbolType) {
      target = {
        _type: SedTargetTypeEnum.SedTarget,
        value: variableData.symbolOrTarget,
        namespaces: namespaces,
      };
    }
    variables.push({
      _type: SedVariableTypeEnum.SedVariable,
      id: variableData.id,
      name: variableData.name,
      symbol: symbolType ? variableData.symbolOrTarget : undefined,
      target: target,
      model: undefined,
      task: '',
    });
  });
  return variables;
}

function CreateSedModel(modelFormat: string, modelChanges: SedModelChange[], modelUrl?: string): SedModel {
  console.log(`model format created: ${modelFormat}`);
  modelChanges.forEach((change: SedModelChange) => {
    console.log(`change created: ${change.id}, ${change._type}`);
  });
  const language = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat]?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
  const fileExtensions = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].fileExtensions?.[0];
  if (modelUrl) {
    console.log(`found model url!`);
    const sourcePathNames = new URL(modelUrl).pathname;
    const parts = sourcePathNames.split('/').filter((part) => part !== '');
    const modelSource = parts[parts.length - 1];
    return {
      _type: SedModelTypeEnum.SedModel,
      id: 'model',
      language: language || '',
      source: modelSource,
      changes: modelChanges,
    };
  } else {
    return {
      _type: SedModelTypeEnum.SedModel,
      id: 'model',
      language: language || '',
      source: 'model.' + fileExtensions,
      changes: modelChanges,
    };
  }
}

function CreateSedAlgorithm(
  algorithmId: string,
  algorithmParameters: Record<string, MultipleSimulatorsAlgorithmParameter> | undefined,
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

function CreateSedSimulation(
  simulationType: SimulationType,
  initialTime: number,
  outputStartTime: number,
  outputEndTime: number,
  numberOfSteps: number,
  algorithm: SedAlgorithm,
): SedSimulation {
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
      initialTime: initialTime as number,
      outputStartTime: outputStartTime as number,
      outputEndTime: outputEndTime as number,
      numberOfSteps: numberOfSteps as number,
      algorithm: algorithm,
    };
  }
}

function CreateSedTask(model: SedModel, simulation: SedSimulation): SedTask {
  console.log(`sed task model to create: ${model.source}`);
  return {
    _type: SedTaskTypeEnum.SedTask,
    id: 'task',
    model: model.id,
    simulation: simulation.id,
  };
}

function CreateSedDataSetAndGenerators(
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
      id: 'data_generator_' + rawId,
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

function CreateSedDocument(
  model: SedModel,
  simulation: SedSimulation,
  task: SedTask,
  dataGenerators: SedDataGenerator[],
  dataSets: SedDataSet[],
): SedDocument {
  console.log(`THE model source and id: ${model.source}, ${model.id}`);
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

function CreateArchiveModelLocationValue(modelFile: File, modelUrl: string): CombineArchiveLocationValue {
  if (modelFile) {
    console.log(`archive file found for ${modelFile}`);
    return {
      _type: CombineArchiveContentFileTypeEnum.CombineArchiveContentFile,
      filename: modelFile.name,
    };
  }
  console.log(`archive url found for ${modelUrl}`);
  return {
    _type: CombineArchiveContentUrlTypeEnum.CombineArchiveContentUrl,
    url: modelUrl,
  };
}

function CompleteArchive(
  modelFormat: string,
  sedDoc: SedDocument,
  locationValue: CombineArchiveLocationValue,
  modelPath: string,
): CombineArchive {
  console.log(`The archive has a model with a path of: ${modelPath}`);
  const formatUri = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].biosimulationsMetadata?.omexManifestUris[0];
  const archive = {
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
        format: 'https://identifiers.org/combine.specifications/sed-ml',
        master: true,
        location: {
          _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
          path: './simulation.sedml',
          value: sedDoc,
        },
      },
    ],
  };

  archive.contents.forEach((item: any, i: number) => {
    console.log(`Item: ${i}: ${Object.keys(item?.location)}`);
  });

  console.log(sedDoc._type);
  return archive;
}
