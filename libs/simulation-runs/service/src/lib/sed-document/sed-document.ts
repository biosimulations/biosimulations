import {
  SedDocument,  
  SerializedSedDocument,
  SedModel,
  SerializedSedModel,
  SedSimulation,
  SedAbstractTask,
  SerializedSedAbstractTask,
  SedDataGenerator,  
  SerializedSedDataGenerator,
  SedVariable,
  SerializedSedVariable,
  SedOutput,
  SerializedSedOutput,
  SedDataSet,
  SerializedSedDataSet,
  SedCurve,
  SerializedSedCurve,
  SedSurface,
  SerializedSedSurface,
} from '@biosimulations/datamodel/common';

type IdMap<T> = {[id: string]: T};

export function deserializeSedDocument(serializedSedDoc: SerializedSedDocument): SedDocument {
  const modelIdMap: IdMap<SedModel> = {};
  serializedSedDoc.models.forEach((model: SerializedSedModel): void => {
    modelIdMap[model.id] = {
      _type: model._type,
      id: model.id,
      name: model?.name,
      language: model.language,
      source: model.source,
      changes: [],
    };
  });

  const simulationIdMap: IdMap<SedSimulation> = {};
  serializedSedDoc.simulations.forEach((simulation: SedSimulation): void => {
    simulationIdMap[simulation.id] = {...simulation};
  });

  const taskIdMap: IdMap<SedAbstractTask> = {};
  serializedSedDoc.tasks.forEach((task: SerializedSedAbstractTask): void => {
    if (task._type === 'SedTask') {
      taskIdMap[task.id] = {
        _type: task._type,
        id: task.id,
        name: task?.name,
        model: modelIdMap[task.model],
        simulation: simulationIdMap[task.simulation],
      };
    } else {
      taskIdMap[task.id] = {
        _type: task._type,
        id: task.id,
        name: task?.name,
      };
    }
  });

  const dataGeneratorIdMap: IdMap<SedDataGenerator> = {};
  serializedSedDoc.dataGenerators.forEach((dataGenerator: SerializedSedDataGenerator): void => {
    dataGeneratorIdMap[dataGenerator.id] = {
      _type: dataGenerator._type,
      id: dataGenerator.id,
      name: dataGenerator?.name,
      parameters: [...dataGenerator.parameters],
      variables: dataGenerator.variables.map((variable: SerializedSedVariable): SedVariable => {
        return {
          _type: variable._type,
          id: variable.id,
          name: variable?.name,
          task: taskIdMap[variable.task],
        };
      }),
      math: dataGenerator.math,
    };
  });

  const outputIdMap: IdMap<SedOutput> = {};
  serializedSedDoc.outputs.forEach((output: SerializedSedOutput): void => {
    if (output._type === 'SedReport') {
      outputIdMap[output.id] = {
        _type: output._type,
        id: output.id,
        name: output?.name,      
        dataSets: output.dataSets.map((dataSet: SerializedSedDataSet): SedDataSet => {
          return {
            _type: dataSet._type,
            id: dataSet.id,
            label: dataSet.label,
            name: dataSet?.name,      
            dataGenerator: dataGeneratorIdMap[dataSet.dataGenerator],
          };
        }),
      };
    } else if (output._type == 'SedPlot2D') {
      outputIdMap[output.id] = {
        _type: output._type,
        id: output.id,
        name: output?.name,      
        curves: output.curves.map((curve: SerializedSedCurve): SedCurve => {
          return {
            _type: curve._type,
            id: curve.id,
            name: curve?.name,      
            xDataGenerator: dataGeneratorIdMap[curve.xDataGenerator],
            yDataGenerator: dataGeneratorIdMap[curve.yDataGenerator],
          };
        }),
        xScale: output.xScale,
        yScale: output.yScale,
      };
    } else {
      outputIdMap[output.id] = {
        _type: output._type,
        id: output.id,
        name: output?.name,      
        surfaces: output.surfaces.map((surface: SerializedSedSurface): SedSurface => {
          return {
            _type: surface._type,
            id: surface.id,
            name: surface?.name,      
            xDataGenerator: dataGeneratorIdMap[surface.xDataGenerator],
            yDataGenerator: dataGeneratorIdMap[surface.yDataGenerator],
            zDataGenerator: dataGeneratorIdMap[surface.zDataGenerator],
          };
        }),
        xScale: output.xScale,
        yScale: output.yScale,
        zScale: output.zScale,
      };
    }
  });

  return {
    _type: serializedSedDoc._type,
    level: serializedSedDoc.level,
    version: serializedSedDoc.version,
    models: serializedSedDoc.models.map((model: SerializedSedModel): SedModel => {
      return modelIdMap[model.id];
    }),
    simulations: serializedSedDoc.simulations.map((simulation: SedSimulation): SedSimulation => {
      return simulationIdMap[simulation.id];
    }),
    tasks: serializedSedDoc.tasks.map((task: SerializedSedAbstractTask): SedAbstractTask => {
      return taskIdMap[task.id];
    }),
    dataGenerators: serializedSedDoc.dataGenerators.map((dataGenerator: SerializedSedDataGenerator): SedDataGenerator => {
      return dataGeneratorIdMap[dataGenerator.id];
    }),
    outputs: serializedSedDoc.outputs.map((output: SerializedSedOutput): SedOutput => {
      return outputIdMap[output.id];
    }),
  };
}