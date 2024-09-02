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
  SedTarget,
  SedTargetTypeEnum,
  SedTask,
  SedTaskTypeEnum,
  SedUniformTimeCourseSimulationTypeEnum,
  SedVariable,
  SedVariableTypeEnum,
} from '@biosimulations/combine-api-angular-client';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { SimulationType, ValueType, SedDocument as CommonSedDoc } from '@biosimulations/datamodel/common';
import { MultipleSimulatorsAlgorithmParameter } from './compatibility';

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
  algorithmParameters: Record<string, MultipleSimulatorsAlgorithmParameter> | null,
  changesData: Record<string, string>[],
  variablesData: Record<string, string>[],
  namespaces: Namespace[],
  metadataFileUrl: string,
  sedFileUrl: string,
  imageUrls: string[],
  rerunModelId?: string,
  uploadedSedDoc?: SedDocument,
): CombineArchive {
  /* To be used in create-project */
  let sedDoc: SedDocument;
  let model: SedModel;

  if (!uploadedSedDoc) {
    const sedChanges = CreateSedModelChanges(changesData, namespaces);
    model = CreateSedModel(modelFormat, sedChanges, modelUrl, rerunModelId);
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
    const sedVariables = CreateSedVariables(variablesData, namespaces, model, task);
    const dataSetGenerators = CreateSedDataSetAndGenerators(sedVariables, task);
    const dataSets = dataSetGenerators[0];
    const dataGenerators = dataSetGenerators[1];
    sedDoc = CreateSedDocument(model, simulation, task, dataGenerators, dataSets);
  } else {
    sedDoc = uploadedSedDoc;
    model = sedDoc.models[0] as SedModel;
  }

  const modelContent = CreateArchiveModelLocationValue(modelFile, modelUrl);
  return CompleteArchiveFromFiles(modelFormat, modelContent, model.source, metadataFileUrl, sedFileUrl, imageUrls);
}

export function CreateArchiveFromSedDoc(
  sedDoc: SedDocument | CommonSedDoc,
  modelUrl: string,
  modelFormat: string,
  modelFile: File,
  imageUrls: string[],
): CombineArchive {
  /* To be used in customize-simulation */
  const model = sedDoc.models[0] as SedModel;
  const modelContent = {
    _type: CombineArchiveContentUrlTypeEnum.CombineArchiveContentUrl,
    url: modelUrl,
  };
  return CompleteArchive(modelFormat, sedDoc, modelContent, model.source, imageUrls);
}

function CreateSedModelChanges(modelChanges: Record<string, string>[], namespaces: Namespace[]): SedModelChange[] {
  const changes: SedModelChange[] = [];
  modelChanges.forEach((changeData: Record<string, string>): void => {
    if (!changeData.newValue || changeData.newValue.length === 0) {
      return;
    }
    if (!changeData.newValue) {
      changeData.newValue = changeData.default;
    }
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
  return changes;
}

function CreateSedVariables(
  modelVariables: Record<string, string>[],
  namespaces: Namespace[],
  model: SedModel,
  task: SedTask,
): SedVariable[] {
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
      model: model.id,
      task: task.id,
    });
  });
  return variables;
}

function CreateSedModel(
  modelFormat: string,
  modelChanges: SedModelChange[],
  modelUrl?: string,
  rerunId?: string,
): SedModel {
  const language = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat]?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
  const fileExtensions = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].fileExtensions?.[0];

  let modelId = '';
  if (rerunId) {
    modelId = rerunId;
  } else {
    modelId = 'model';
  }

  let modelSource = '';
  if (modelUrl) {
    console.log(`found model url!`);
    const sourcePathNames = new URL(modelUrl).pathname;
    const parts = sourcePathNames.split('/').filter((part) => part !== '');
    modelSource = parts[parts.length - 1];
  } else {
    modelSource = 'model.' + fileExtensions;
  }
  return {
    _type: SedModelTypeEnum.SedModel,
    id: modelId,
    language: language || '',
    source: modelSource,
    changes: modelChanges,
  };
}

function CreateSedAlgorithm(
  algorithmId: string,
  algorithmParameters: Record<string, MultipleSimulatorsAlgorithmParameter> | undefined | any,
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
      id: 'simulation_1',
      algorithm: algorithm,
    };
  } else {
    return {
      _type: SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation,
      id: 'simulation_1',
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
    id: 'task_1',
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
      id: 'data_set_' + rawId,
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

function CompleteArchiveFromFiles(
  modelFormat: string,
  locationValue: CombineArchiveLocationValue,
  modelPath: string,
  metadataFileUrl: string,
  sedFileUrl: string,
  imgUrls: string[],
): CombineArchive {
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
        format: 'http://identifiers.org/combine.specifications/sed-ml',
        master: true,
        location: {
          _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
          path: 'simulation.sedml',
          value: {
            _type: CombineArchiveContentUrlTypeEnum.CombineArchiveContentUrl,
            url: sedFileUrl,
          },
        },
      },
    ],
  };
  return AddImagesToArchive(imgUrls, archive);
}

function AddImagesToArchive(urls: string[], archive: CombineArchive): CombineArchive {
  if (urls?.length >= 1) {
    urls.forEach((url: string) => {
      const imgPath = getFileNameFromUrl(url) as string;
      const archiveContent = {
        _type: CombineArchiveContentTypeEnum.CombineArchiveContent,
        format: 'http://purl.org/NET/mediatypes/image/jpeg',
        master: false,
        location: {
          _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
          path: imgPath,
          value: {
            _type: CombineArchiveContentUrlTypeEnum.CombineArchiveContentUrl,
            url: url,
          },
        },
      };
      archive.contents.push(archiveContent);
    });
  }
  return archive;
}

function getFileNameFromUrl(url: string): string | undefined {
  const urlObj = new URL(url);
  const parts = urlObj.pathname.split('/');
  return parts.pop();
}

function CompleteArchive(
  modelFormat: string,
  sedDoc: SedDocument | CommonSedDoc,
  locationValue: CombineArchiveLocationValue,
  modelPath: string,
  imageUrls: string[],
): CombineArchive {
  const modelFormatUri = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat].biosimulationsMetadata?.omexManifestUris[0];
  const sedUri = 'http://identifiers.org/combine.specifications/sed-ml';

  return {
    _type: CombineArchiveTypeEnum.CombineArchive,
    contents: [
      {
        _type: CombineArchiveContentTypeEnum.CombineArchiveContent,
        format: modelFormatUri as string,
        master: false,
        location: {
          _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
          path: modelPath,
          value: locationValue,
        },
      },
      {
        _type: CombineArchiveContentTypeEnum.CombineArchiveContent,
        format: sedUri,
        master: true,
        location: {
          _type: CombineArchiveLocationTypeEnum.CombineArchiveLocation,
          path: 'simulation.sedml',
          value: sedDoc as SedDocument,
        },
      },
    ],
  };
}
