import {
  SedDocument,
  SerializedSedDocument,
  SedStyle,
  SerializedSedStyle,
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
  SedRange,
  SerializedSedRange,
  SedFunctionalRange,
  SerializedSedFunctionalRange,
  SerializedSedRepeatedTask,
  SedSubTask,
  SerializedSedSubTask,
  SedSetValueComputeModelChange,
  SerializedSedSetValueComputeModelChange,
  SedModelChange,
  SerializedSedModelChange,
} from '@biosimulations/datamodel/common';

type IdMap<T> = { [id: string]: T };

type TempSedFunctionalRange = Omit<SedFunctionalRange, 'range'> & {
  range?: TempSedRange;
};

type TempSedRange =
  | Exclude<SedRange, SedFunctionalRange>
  | TempSedFunctionalRange;

/** Deserialize a serialized SED-ML document.
 *
 * Deserialize the following relationships:
 *
 * - `SedStyle.base` -> `SedStyle`
 * - `SedTask.model` -> `SedModel`
 * - `SedTask.simulation` -> `SedSimulation`
 * - `SedRepeatedTask.range` -> `SedRange`
 * - `SedSetValueComputeModelChange.model` -> `SedModel`
 * - `SedSetValueComputeModelChange.range` -> `SedRange`
 * - `SedSubTask.task` -> `SedAbstrackTask`
 * - `FunctionalRange.range` -> `SedRange`
 * - `SedDataSet.datagenerator` -> `SedDataGenerator`
 * - `SedCurve.xDataGenerator` -> `SedDataGenerator`
 * - `SedCurve.yDataGenerator` -> `SedDataGenerator`
 * - `SedCurve.style` -> `SedStyle`
 * - `SedSurface.xDataGenerator` -> `SedDataGenerator`
 * - `SedSurface.yDataGenerator` -> `SedDataGenerator`
 * - `SedSurface.zDataGenerator` -> `SedDataGenerator`
 * - `SedSurface.style` -> `SedStyle`
 * - `SedVariable.task` -> `SedAbstrackTask`
 * - `SedVariable.model` -> `SedModel`
 *
 * @param serializedSedDoc serialized SED-ML document
 */
export function deserializeSedDocument(
  serializedSedDoc: SerializedSedDocument,
): SedDocument {
  serializedSedDoc = JSON.parse(JSON.stringify(serializedSedDoc));

  const styleIdMap: IdMap<SedStyle> = {};
  serializedSedDoc.styles.forEach(
    (serializedStyle: SerializedSedStyle): void => {
      const style: SedStyle = styleIdMap[serializedStyle.id] = {
        _type: serializedStyle._type,
        id: serializedStyle.id,
        name: serializedStyle?.name,
      };

      if (serializedStyle?.line) {
        style.line = Object.assign({}, serializedStyle.line);
      }
      if (serializedStyle?.marker) {
        style.marker = Object.assign({}, serializedStyle.marker);
      }
      if (serializedStyle?.fill) {
        style.fill = Object.assign({}, serializedStyle.fill);
      }
    },
  );

  serializedSedDoc.styles.forEach(
    (serializedStyle: SerializedSedStyle): void => {
      const style: SedStyle = styleIdMap[serializedStyle.id];
      if (serializedStyle?.base) {
        style.base = styleIdMap?.[serializedStyle.base];
      }
    }
  )

  const modelIdMap: IdMap<SedModel> = {};
  serializedSedDoc.models.forEach(
    (serializedModel: SerializedSedModel): void => {
      modelIdMap[serializedModel.id] = {
        _type: serializedModel._type,
        id: serializedModel.id,
        name: serializedModel?.name,
        language: serializedModel.language,
        source: serializedModel.source,
        changes: [], // todo
      };
    },
  );

  const simulationIdMap: IdMap<SedSimulation> = {};
  serializedSedDoc.simulations.forEach(
    (serializedSimulation: SedSimulation): void => {
      simulationIdMap[serializedSimulation.id] = serializedSimulation;
    },
  );

  const ranges = serializedSedDoc.tasks
    .flatMap(
      (serializedTask: SerializedSedAbstractTask): SerializedSedRange[] => {
        if (serializedTask._type === 'SedRepeatedTask') {
          return serializedTask.ranges;
        } else {
          return [];
        }
      },
    )
    .map(
      (
        serializedRange: SerializedSedRange,
      ): [SerializedSedRange, TempSedRange] => {
        switch (serializedRange._type) {
          case 'SedFunctionalRange':
            return [
              serializedRange,
              {
                _type: serializedRange._type,
                id: serializedRange.id,
                name: serializedRange?.name,
                range: undefined,
                parameters: serializedRange.parameters,
                variables: [],
                math: serializedRange.math,
              },
            ];
          case 'SedUniformRange':
          case 'SedVectorRange':
            return [serializedRange, serializedRange];
        }
      },
    );

  const tempRangeIdMap: IdMap<TempSedRange> = {};
  const rangeIdMap: IdMap<SedRange> = {};
  ranges.forEach((range: [SerializedSedRange, TempSedRange]): void => {
    tempRangeIdMap[range[0].id] = range[1];
  });
  ranges
    .flatMap(
      (
        range: [SerializedSedRange, TempSedRange],
      ): [SerializedSedFunctionalRange, TempSedFunctionalRange][] => {
        if (
          range[0]._type === 'SedFunctionalRange' &&
          range[1]._type === 'SedFunctionalRange'
        ) {
          return [[range[0], range[1]]];
        } else {
          return [];
        }
      },
    )
    .map(
      (
        range: [SerializedSedFunctionalRange, TempSedFunctionalRange],
      ): TempSedFunctionalRange => {
        range[1].range = tempRangeIdMap[range[0].range];
        return range[1];
      },
    )
    .forEach((range: TempSedFunctionalRange): void => {
      if (range.range) {
        rangeIdMap[range.id] = range as SedRange;
      }
    });

  const taskIdMap: IdMap<SedAbstractTask> = {};
  serializedSedDoc.tasks.forEach(
    (serializedTask: SerializedSedAbstractTask): void => {
      if (serializedTask._type === 'SedTask') {
        taskIdMap[serializedTask.id] = {
          _type: serializedTask._type,
          id: serializedTask.id,
          name: serializedTask?.name,
          model: modelIdMap[serializedTask.model],
          simulation: simulationIdMap[serializedTask.simulation],
        };
      } else {
        taskIdMap[serializedTask.id] = {
          _type: serializedTask._type,
          id: serializedTask.id,
          name: serializedTask?.name,
          ranges: serializedTask.ranges.map(
            (serializedRange: SerializedSedRange): SedRange => {
              return rangeIdMap[serializedRange.id];
            },
          ),
          range: rangeIdMap[serializedTask.range],
          resetModelForEachIteration: serializedTask.resetModelForEachIteration,
          changes: [],
          subTasks: [],
        };
      }
    },
  );

  serializedSedDoc.models.forEach(
    (serializedModel: SerializedSedModel): void => {
      const model = modelIdMap[serializedModel.id];
      model.changes = serializedModel.changes.map(
        (serializedChange: SerializedSedModelChange): SedModelChange => {
          if (serializedChange._type === 'SedComputeModelChange') {
            return {
              _type: serializedChange._type,
              id: serializedChange.id,
              name: serializedChange?.name,
              target: serializedChange.target,
              parameters: serializedChange.parameters,
              variables: serializedChange.variables.map(
                (serializedVariable: SerializedSedVariable): SedVariable => {
                  return deserializeSedVariable(
                    serializedVariable,
                    modelIdMap,
                    taskIdMap,
                  );
                },
              ),
              math: serializedChange.math,
            };
          } else {
            return serializedChange;
          }
        },
      );
    },
  );

  serializedSedDoc.tasks
    .flatMap(
      (
        serializedTask: SerializedSedAbstractTask,
      ): SerializedSedRepeatedTask[] => {
        if (serializedTask._type === 'SedRepeatedTask') {
          return [serializedTask];
        } else {
          return [];
        }
      },
    )
    .forEach((serializedTask: SerializedSedRepeatedTask): void => {
      const task = taskIdMap[serializedTask.id];
      if (task._type === 'SedRepeatedTask') {
        serializedTask.ranges
          .flatMap(
            (
              serializedRange: SerializedSedRange,
            ): SerializedSedFunctionalRange[] => {
              if (serializedRange._type === 'SedFunctionalRange') {
                return [serializedRange];
              } else {
                return [];
              }
            },
          )
          .forEach((serializedRange: SerializedSedFunctionalRange) => {
            const range = rangeIdMap[serializedRange.id];
            if ('variables' in range) {
              range.variables = serializedRange.variables.map(
                (serializedVariable: SerializedSedVariable): SedVariable => {
                  return deserializeSedVariable(
                    serializedVariable,
                    modelIdMap,
                    taskIdMap,
                  );
                },
              );
            }
          });

        task.changes = serializedTask.changes.map(
          (
            serializedChange: SerializedSedSetValueComputeModelChange,
          ): SedSetValueComputeModelChange => {
            return {
              _type: serializedChange._type,
              id: serializedChange.id,
              name: serializedChange?.name,
              model: modelIdMap[serializedChange.model],
              target: serializedChange.target,
              symbol: serializedChange?.symbol,
              range: serializedChange?.range
                ? rangeIdMap[serializedChange.range]
                : undefined,
              parameters: serializedChange.parameters,
              variables: serializedChange.variables.map(
                (serializedVariable: SerializedSedVariable): SedVariable => {
                  return deserializeSedVariable(
                    serializedVariable,
                    modelIdMap,
                    taskIdMap,
                  );
                },
              ),
              math: serializedChange.math,
            };
          },
        );

        task.subTasks = serializedTask.subTasks.map(
          (serializedSubTask: SerializedSedSubTask): SedSubTask => {
            return {
              _type: serializedSubTask._type,
              task: taskIdMap[serializedSubTask.task],
              order: serializedSubTask.order,
            };
          },
        );
      }
    });

  const dataGeneratorIdMap: IdMap<SedDataGenerator> = {};
  serializedSedDoc.dataGenerators.forEach(
    (serializedDataGenerator: SerializedSedDataGenerator): void => {
      dataGeneratorIdMap[serializedDataGenerator.id] = {
        _type: serializedDataGenerator._type,
        id: serializedDataGenerator.id,
        name: serializedDataGenerator?.name,
        parameters: serializedDataGenerator.parameters,
        variables: serializedDataGenerator.variables.map(
          (serializedVariable: SerializedSedVariable): SedVariable => {
            return deserializeSedVariable(
              serializedVariable,
              modelIdMap,
              taskIdMap,
            );
          },
        ),
        math: serializedDataGenerator.math,
      };
    },
  );

  const outputIdMap: IdMap<SedOutput> = {};
  serializedSedDoc.outputs.forEach(
    (serializedOutput: SerializedSedOutput): void => {
      if (serializedOutput._type === 'SedReport') {
        outputIdMap[serializedOutput.id] = {
          _type: serializedOutput._type,
          id: serializedOutput.id,
          name: serializedOutput?.name,
          dataSets: serializedOutput.dataSets.map(
            (serializedDataSet: SerializedSedDataSet): SedDataSet => {
              return {
                _type: serializedDataSet._type,
                id: serializedDataSet.id,
                label: serializedDataSet.label,
                name: serializedDataSet?.name,
                dataGenerator:
                  dataGeneratorIdMap[serializedDataSet.dataGenerator],
              };
            },
          ),
        };
      } else if (serializedOutput._type == 'SedPlot2D') {
        outputIdMap[serializedOutput.id] = {
          _type: serializedOutput._type,
          id: serializedOutput.id,
          name: serializedOutput?.name,
          curves: serializedOutput.curves.map(
            (serializedCurve: SerializedSedCurve): SedCurve => {
              return {
                _type: serializedCurve._type,
                id: serializedCurve.id,
                name: serializedCurve?.name,
                xDataGenerator:
                  dataGeneratorIdMap[serializedCurve.xDataGenerator],
                yDataGenerator:
                  dataGeneratorIdMap[serializedCurve.yDataGenerator],
                style: serializedCurve?.style 
                  ? styleIdMap?.[serializedCurve.style] 
                  : undefined,
              };
            },
          ),
          xScale: serializedOutput.xScale,
          yScale: serializedOutput.yScale,
        };
      } else {
        outputIdMap[serializedOutput.id] = {
          _type: serializedOutput._type,
          id: serializedOutput.id,
          name: serializedOutput?.name,
          surfaces: serializedOutput.surfaces.map(
            (serializedSurface: SerializedSedSurface): SedSurface => {
              return {
                _type: serializedSurface._type,
                id: serializedSurface.id,
                name: serializedSurface?.name,
                xDataGenerator:
                  dataGeneratorIdMap[serializedSurface.xDataGenerator],
                yDataGenerator:
                  dataGeneratorIdMap[serializedSurface.yDataGenerator],
                zDataGenerator:
                  dataGeneratorIdMap[serializedSurface.zDataGenerator],
                style: serializedSurface?.style 
                  ? styleIdMap?.[serializedSurface.style]
                  : undefined,
              };
            },
          ),
          xScale: serializedOutput.xScale,
          yScale: serializedOutput.yScale,
          zScale: serializedOutput.zScale,
        };
      }
    },
  );

  return {
    _type: serializedSedDoc._type,
    level: serializedSedDoc.level,
    version: serializedSedDoc.version,
    styles: serializedSedDoc.styles.map(
      (serializedStyle: SerializedSedStyle): SedStyle => {
        return styleIdMap[serializedStyle.id];
      },
    ),
    models: serializedSedDoc.models.map(
      (serializedModel: SerializedSedModel): SedModel => {
        return modelIdMap[serializedModel.id];
      },
    ),
    simulations: serializedSedDoc.simulations.map(
      (serializedSimulation: SedSimulation): SedSimulation => {
        return simulationIdMap[serializedSimulation.id];
      },
    ),
    tasks: serializedSedDoc.tasks.map(
      (serializedTask: SerializedSedAbstractTask): SedAbstractTask => {
        return taskIdMap[serializedTask.id];
      },
    ),
    dataGenerators: serializedSedDoc.dataGenerators.map(
      (
        serializedDataGenerator: SerializedSedDataGenerator,
      ): SedDataGenerator => {
        return dataGeneratorIdMap[serializedDataGenerator.id];
      },
    ),
    outputs: serializedSedDoc.outputs.map(
      (serializedOutput: SerializedSedOutput): SedOutput => {
        return outputIdMap[serializedOutput.id];
      },
    ),
  };
}

function deserializeSedVariable(
  serializedVariable: SerializedSedVariable,
  modelIdMap: IdMap<SedModel>,
  taskIdMap: IdMap<SedAbstractTask>,
): SedVariable {
  return {
    _type: serializedVariable._type,
    id: serializedVariable.id,
    name: serializedVariable?.name,
    task: taskIdMap[serializedVariable.task],
    model: serializedVariable?.model
      ? modelIdMap[serializedVariable.model]
      : undefined,
  };
}
