import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  ValueType,
  SimulationType,
  SimulationTypeName,
  ModelFormat,
  MODEL_FORMATS,
} from '@biosimulations/datamodel/common';
import {
  DispatchService,
  SimulatorsData,
  SimulatorSpecs,
  SimulatorSpecsMap,
  ModelingFrameworksAlgorithmsForModelFormat,
  AlgorithmParameter,
} from '../../../services/dispatch/dispatch.service';
import {
  AlgorithmSubstitutionPolicyLevels,
  ALGORITHM_SUBSTITUTION_POLICIES,
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
} from '../../../kisao.interface';
import { CombineService } from '../../../services/combine/combine.service';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { map, concatAll, withLatestFrom, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import isUrl from 'is-url';
import { urls } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@biosimulations/shared/environments';
import { validateValue } from '@biosimulations/datamodel/utils';
import { ConfigService } from '@biosimulations/shared/services';

enum LocationType {
  file = 'file',
  url = 'url',
}

interface OntologyTerm {
  id: string;
  name: string;
}

const MODEL_FORMAT_EDAM_ID_MAP: { [id: string]: ModelFormat } = {};
MODEL_FORMATS.forEach((modelFormat: ModelFormat): void => {
  MODEL_FORMAT_EDAM_ID_MAP[modelFormat.edamId] = modelFormat;
});

enum ModelVariableType {
  symbol = 'symbol',
  target = 'target',
}

interface Simulator {
  id: string;
  name: string;
  url: string;
}

interface MultipleSimulatorsAlgorithmParameter {
  id: string;
  name: string;
  url: string;
  simulators: Set<string>;
  type: ValueType | '--multiple--';
  value: string | null | '--multiple--';
  formattedValue: string | '--multiple--';
  recommendedRange: string[] | null | '--multiple--';
  formattedRecommendedRange: string[] | '--multiple--';
  formattedRecommendedRangeJoined: string | '--multiple--';
}

type PostCreateAction = 'download' | 'simulate';

interface CompatibleSimulator {
  simulator: Simulator;
  maxPolicy: AlgorithmSubstitutionPolicy;
  parametersCompatibility: boolean;
}

@Component({
  selector: 'biosimulations-create-simulation-project',
  templateUrl: './create-simulation-project.component.html',
  styleUrls: ['./create-simulation-project.component.scss'],
})
export class CreateSimulationProjectComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  modelNamespacesArray: FormArray;
  modelChangesArray: FormArray;
  simulationAlgorithmParametersArray: FormArray;
  modelVariablesArray: FormArray;

  private simulatorSpecs?: SimulatorSpecs[];
  private simulatorSpecsMap?: SimulatorSpecsMap;
  private algSubstitutions?: { [id: string]: AlgorithmSubstitutionPolicy };
  private allModelFormats?: OntologyTerm[];
  private allModelingFrameworks?: OntologyTerm[];
  private allSimulationTypes = [
    {
      id: SimulationType.SedOneStepSimulation,
      name: SimulationTypeName.SedOneStepSimulation.substr(4),
    },
    {
      id: SimulationType.SedSteadyStateSimulation,
      name: SimulationTypeName.SedSteadyStateSimulation.substr(4),
    },
    {
      id: SimulationType.SedUniformTimeCourseSimulation,
      name: SimulationTypeName.SedUniformTimeCourseSimulation.substr(4),
    },
  ] as OntologyTerm[];
  private allSimulationAlgorithms?: OntologyTerm[];
  modelFormats?: OntologyTerm[];
  modelingFrameworks?: OntologyTerm[];
  simulationTypes?: OntologyTerm[];
  simulationAlgorithms?: OntologyTerm[];
  modelVariableTypes = [
    {
      id: ModelVariableType.symbol,
      name: 'Symbol',
    },
    {
      id: ModelVariableType.target,
      name: 'Target',
    },
  ] as OntologyTerm[];
  compatibleSimulators?: CompatibleSimulator[];

  modelFileTypeSpecifiers!: string;
  private static INIT_MODEL_NAMESPACES = 1;
  private static INIT_MODEL_CHANGES = 3;
  private static INIT_MODEL_VARIABLES = 5;
  exampleModelUrl =
    'https://raw.githubusercontent.com/biosimulators/Biosimulators_utils/dev/tests/fixtures/BIOMD0000000297.xml';

  submitPushed = false;
  projectBeingCreated = false;

  private subscriptions: Subscription[] = [];
  private modelParametersAndVariablesSubscription: Subscription | undefined =
    undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private combineService: CombineService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private config: ConfigService,
  ) {
    const modelFileTypeSpecifiers = new Set<string>();
    MODEL_FORMATS.filter((modelFormat: ModelFormat): boolean => {
      return modelFormat.introspectionAvailable;
    }).forEach((modelFormat: ModelFormat): void => {
      modelFormat.extensions.forEach((extension: string): void => {
        modelFileTypeSpecifiers.add('.' + extension);
      });
      modelFormat.mediaTypes.forEach((mediaType: string): void => {
        modelFileTypeSpecifiers.add(mediaType);
      });
    });
    this.modelFileTypeSpecifiers = Array.from(modelFileTypeSpecifiers).join(
      ',',
    );

    this.formGroup = this.formBuilder.group(
      {
        modelLocationType: [LocationType.file, Validators.required],
        modelLocationDetails: [
          null,
          [Validators.required, this.maxFileSizeValidator],
        ],
        modelFormat: [null, Validators.required],
        modelNamespaces: this.formBuilder.array([], {
          validators: [this.uniqueAttributeValidator.bind(this, 'prefix')],
        }),
        modelChanges: this.formBuilder.array([], {
          validators: [this.uniqueAttributeValidator.bind(this, 'id')],
        }),
        modelingFramework: [null, Validators.required],
        simulationType: [null, Validators.required],
        oneStepSimulationParameters: this.formBuilder.group({
          step: [null, this.positiveFloatValidator],
        }),
        uniformTimeCourseSimulationParameters: this.formBuilder.group(
          {
            initialTime: [null, this.floatValidator],
            outputStartTime: [null, this.floatValidator],
            outputEndTime: [null, this.floatValidator],
            numberOfSteps: [null, this.nonNegativeIntegerValidator],
            step: [null],
          },
          {
            validators: this.uniformTimeCourseValidator,
          },
        ),
        simulationAlgorithm: [null, Validators.required],
        simulationAlgorithmParameters: this.formBuilder.array([]),
        modelVariables: this.formBuilder.array([], {
          validators: [this.uniqueAttributeValidator.bind(this, 'id')],
        }),
      },
      {
        validators: [this.hasCompatibleSimulatorValidator.bind(this)],
      },
    );

    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;
    const uniformTimeCourseSimulationParametersControl = this.formGroup.controls
      .uniformTimeCourseSimulationParameters as FormGroup;
    const uniformTimeCourseSimulationStepControl =
      uniformTimeCourseSimulationParametersControl.controls.step as FormControl;
    uniformTimeCourseSimulationStepControl.disable();
    const simulationAlgorithmControl = this.formGroup.controls
      .simulationAlgorithm as FormControl;
    this.modelNamespacesArray = this.formGroup.controls
      .modelNamespaces as FormArray;
    this.modelChangesArray = this.formGroup.controls.modelChanges as FormArray;
    this.simulationAlgorithmParametersArray = this.formGroup.controls
      .simulationAlgorithmParameters as FormArray;
    this.modelVariablesArray = this.formGroup.controls
      .modelVariables as FormArray;

    while (
      this.modelNamespacesArray.controls.length <
      CreateSimulationProjectComponent.INIT_MODEL_NAMESPACES
    ) {
      this.addModelNamespace();
    }
    while (
      this.modelChangesArray.controls.length <
      CreateSimulationProjectComponent.INIT_MODEL_CHANGES
    ) {
      this.addModelChange();
    }
    while (
      this.modelVariablesArray.controls.length <
      CreateSimulationProjectComponent.INIT_MODEL_VARIABLES
    ) {
      this.addModelVariable();
    }

    modelFormatControl.disable();
    modelingFrameworkControl.disable();
    simulationTypeControl.disable();
    simulationAlgorithmControl.disable();
  }

  maxFileSizeValidator(control: FormControl): ValidationErrors | null {
    if (
      control.value &&
      control.value.size > this.config.appConfig.maxUploadFileSize
    ) {
      return {
        maxSize: true,
      };
    } else {
      return null;
    }
  }

  urlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && isUrl(control.value)) {
      return null;
    } else {
      return {
        url: false,
      };
    }
  }

  positiveFloatValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value) || value <= 0) {
      return {
        positiveFloat: true,
      };
    } else {
      return null;
    }
  }

  floatValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value)) {
      return {
        float: true,
      };
    } else {
      return null;
    }
  }

  nonNegativeIntegerValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value) || value < 0 || Math.floor(value) !== value) {
      return {
        nonNegativeInteger: true,
      };
    } else {
      return null;
    }
  }

  uniformTimeCourseValidator(formGroup: FormGroup): ValidationErrors | null {
    const initialTime = formGroup.value.initialTime;
    const outputStartTime = formGroup.value.outputStartTime;
    const outputEndTime = formGroup.value.outputEndTime;

    const errors: any = {};

    if (
      !isNaN(initialTime) &&
      !isNaN(outputStartTime) &&
      !isNaN(outputEndTime)
    ) {
      if (initialTime > outputStartTime) {
        errors['initialTimeGreaterThanOutputStartTime'] = true;
      }
      if (outputStartTime > outputEndTime) {
        errors['outputStartTimeGreaterThanOutputEndTime'] = true;
      }
    }

    if (Object.keys(errors).length) {
      return errors;
    } else {
      return null;
    }
  }

  parameterValidator(formGroup: FormGroup): ValidationErrors | null {
    const type = formGroup.value.type as ValueType | '--multiple--';
    const formattedRecommendedRange = formGroup.value
      .formattedRecommendedRange as string[] | null | '--multiple--';
    const value: string = formGroup.value.newValue;

    if (!value) {
      return null;
    }

    if (type === '--multiple--') {
      return null;
    }

    if (validateValue(value, type, (id: string) => true)) {
      if (
        [ValueType.string, ValueType.kisaoId].includes(type) &&
        formattedRecommendedRange &&
        formattedRecommendedRange !== '--multiple--'
      ) {
        if (formattedRecommendedRange.includes(value)) {
          return null;
        } else {
          return { invalid: true };
        }
      } else {
        return null;
      }
    } else {
      return { invalid: true };
    }
  }

  namespacePrefixValidator(formControl: FormControl): ValidationErrors | null {
    const prefixPattern = /^[a-z_][a-z_0-9\-.]+$/i;
    const value = formControl.value;
    if (!value || (value && formControl.value.match(prefixPattern))) {
      return null;
    } else {
      return {
        validNamespacePrefix: true,
      };
    }
  }

  sedmlIdValidator(formControl: FormControl): ValidationErrors | null {
    const idPattern = /^[a-z_][a-z0-9_]+$/i;
    const value = formControl.value;
    if (value && formControl.value.match(idPattern)) {
      return null;
    } else {
      return {
        validSedmlId: true,
      };
    }
  }

  uniqueAttributeValidator(
    attrName: string,
    formArray: AbstractControl,
  ): ValidationErrors | null {
    const values = (formArray as FormArray).value as any[];

    const uniqueValues = new Set<string>(
      values.map((value: any): string => {
        return value?.[attrName];
      }),
    );

    if (uniqueValues.size === values.length) {
      return null;
    } else {
      const error: any = {};
      error[attrName + 'Unique'] = true;
      return error;
    }
  }

  hasCompatibleSimulatorValidator(
    formGroup: FormGroup,
  ): ValidationErrors | null {
    const modelFormatControl = formGroup.controls.modelFormat as FormControl;
    const modelingFrameworkControl = formGroup.controls
      .modelingFramework as FormControl;
    const simulationAlgorithmControl = formGroup.controls
      .simulationAlgorithm as FormControl;
    const simulationAlgorithmParametersArray = formGroup.controls
      .simulationAlgorithmParameters as FormArray;

    const formatEdamId = modelFormatControl.value;
    const frameworkSboId = modelingFrameworkControl.value;
    const algKisaoId = simulationAlgorithmControl.value;

    const simCompatibilities: {
      [id: string]: {
        algorithm: AlgorithmSubstitutionPolicy;
        parameters: boolean;
      };
    } = {};
    this.simulatorSpecs?.forEach((simulator: SimulatorSpecs): void => {
      simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
        (
          modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
        ): void => {
          if (
            modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.includes(
              formatEdamId,
            ) &&
            modelingFrameworksAlgorithmsForModelFormat.frameworkSboIds.includes(
              frameworkSboId,
            )
          ) {
            if (
              modelingFrameworksAlgorithmsForModelFormat.algorithmKisaoIds.includes(
                algKisaoId,
              )
            ) {
              simCompatibilities[simulator.id] = {
                algorithm:
                  ALGORITHM_SUBSTITUTION_POLICIES[
                    AlgorithmSubstitutionPolicyLevels.SAME_METHOD
                  ],
                parameters: true,
              };
            }

            modelingFrameworksAlgorithmsForModelFormat.algorithmKisaoIds.forEach(
              (simAlgId: string): void => {
                const policy =
                  this.algSubstitutions?.[simAlgId + '/' + algKisaoId];
                if (policy) {
                  if (!(simulator.id in simCompatibilities)) {
                    simCompatibilities[simulator.id] = {
                      algorithm: policy,
                      parameters: true,
                    };
                  } else if (
                    policy.level <
                    simCompatibilities[simulator.id].algorithm.level
                  ) {
                    simCompatibilities[simulator.id].algorithm = policy;
                  }
                }
              },
            );
          }
        },
      );
    });

    formGroup.value.simulationAlgorithmParameters.forEach(
      (control: any): void => {
        if (control.newValue) {
          Object.entries(simCompatibilities).forEach(
            ([simId, compatability]: [string, any]): void => {
              if (
                !control.simulators.has(simId) &&
                compatability.algorithm.level <
                  AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK
              ) {
                simCompatibilities[simId].parameters = false;
              }
            },
          );
        }
      },
    );

    this.compatibleSimulators = Object.entries(simCompatibilities).map(
      ([simId, compatability]: [string, any]): CompatibleSimulator => {
        return {
          simulator: {
            id: simId,
            name: this.simulatorSpecsMap?.[simId]?.name as string,
            url: `${urls.simulators}/simulators/${simId}`,
          },
          maxPolicy: compatability.algorithm,
          parametersCompatibility: compatability.parameters,
        };
      },
    );

    if (!this.simulatorSpecs || this.compatibleSimulators?.length) {
      return null;
    } else {
      return {
        hasCompatibleSimulator: true,
      };
    }
  }

  changeModelLocationType(): void {
    const locationTypeControl = this.formGroup.controls
      .modelLocationType as FormControl;
    const locationType: LocationType = locationTypeControl.value;
    if (locationType === LocationType.file) {
      this.formGroup.setControl(
        'modelLocationDetails',
        this.formBuilder.control('', [
          Validators.required,
          this.maxFileSizeValidator,
        ]),
      );
    } else {
      this.formGroup.setControl(
        'modelLocationDetails',
        this.formBuilder.control('', [this.urlValidator]),
      );
    }

    this.getModelParametersAndVariables();
  }

  changeUniformTimeCourseSimulationStep(): void {
    const paramsGroup = this.formGroup.controls
      .uniformTimeCourseSimulationParameters as FormGroup;
    const outputEndTimeControl = paramsGroup.controls
      .outputEndTime as FormControl;
    const outputStartTimeControl = paramsGroup.controls
      .outputStartTime as FormControl;
    const numberOfStepsControl = paramsGroup.controls
      .numberOfSteps as FormControl;

    if (
      outputEndTimeControl.value != null &&
      outputStartTimeControl.value != null &&
      numberOfStepsControl.value != null
    ) {
      paramsGroup.controls.step.setValue(
        (outputEndTimeControl.value - outputStartTimeControl.value) /
          numberOfStepsControl.value,
      );
    }
  }

  getModelParametersAndVariables(): void {
    if (this.modelParametersAndVariablesSubscription) {
      this.modelParametersAndVariablesSubscription.unsubscribe();
      const iSub = this.subscriptions.indexOf(
        this.modelParametersAndVariablesSubscription,
      );
      this.subscriptions.splice(iSub, 1);
      this.modelParametersAndVariablesSubscription = undefined;
    }

    const modelLocationTypeControl = this.formGroup.controls
      .modelLocationType as FormControl;
    const modelLocationDetailsControl = this.formGroup.controls
      .modelLocationDetails as FormControl;

    const modelLocationType: LocationType = modelLocationTypeControl.value;
    const modelLocationDetails: File | string =
      modelLocationDetailsControl.value;

    if (
      !modelLocationDetails ||
      (modelLocationType == LocationType.url &&
        !isUrl(modelLocationDetails as string))
    ) {
      return;
    }

    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;
    const simulationAlgorithmControl = this.formGroup.controls
      .simulationAlgorithm as FormControl;

    const modelFormat = modelFormatControl.value as string;
    const modelingFramework = modelingFrameworkControl.value as string;
    const simulationType = simulationTypeControl.value as SimulationType;
    const simulationAlgorithm = simulationAlgorithmControl.value as string;

    if (
      !modelFormat ||
      !modelingFramework ||
      !simulationType ||
      !simulationAlgorithm
    ) {
      return;
    }

    const modelNamespacesArray = this.formGroup.controls
      .modelNamespaces as FormArray;
    const modelChangesArray = this.formGroup.controls.modelChanges as FormArray;
    const modelVariablesArray = this.formGroup.controls
      .modelVariables as FormArray;

    const formData = new FormData();
    if (modelLocationType === LocationType.file) {
      formData.append('modelFile', modelLocationDetails);
    } else {
      formData.append('modelUrl', modelLocationDetails);
    }
    formData.append(
      'modelLanguage',
      MODEL_FORMAT_EDAM_ID_MAP[modelFormat].sedUrn,
    );
    formData.append('modelingFramework', modelingFramework);
    formData.append('simulationType', simulationType);
    formData.append('simulationAlgorithm', simulationAlgorithm);

    const url = `${urls.combineApi}sed-ml/get-parameters-variables-for-simulation`;
    const sedDoc = this.http.post<any>(url, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<null> => {
        if (!environment.production) {
          console.error(error);
        }

        let msg =
          'Sorry! We were unable to get the input parameters and output variables of your model. ' +
          'This feature is only currently available for models encoded in BNGL, CellML, SBML, SBML-fbc, ' +
          'SBML-qual, and Smoldyn.';
        if (modelLocationType === LocationType.url) {
          msg += ` Please check that ${modelLocationDetails} is an accessible URL.`;
        }

        this.snackBar.open(msg, undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        return of<null>(null);
      }),
    );
    const modelParametersAndVariablesSubscription = sedDoc.subscribe(
      (sedDoc: any): void => {
        modelNamespacesArray.clear();
        modelChangesArray.clear();
        modelVariablesArray.clear();

        const nsMap: {
          [prefix: string]: { prefix: string | null; uri: string };
        } = {};
        const changeVals: any[] = [];
        const varVals: any[] = [];

        sedDoc?.models?.[0]?.changes?.forEach((change: any): void => {
          change.target.namespaces.forEach((ns: any): void => {
            const prefixKey = ns.prefix || '';
            if (!(prefixKey in nsMap)) {
              this.addModelNamespace();
            }
            nsMap[prefixKey] = {
              prefix: ns?.prefix || null,
              uri: ns.uri,
            };
          });

          this.addModelChange();
          changeVals.push({
            target: change.target.value,
            id: change.id,
            name: change?.name || null,
            default: change.newValue,
            newValue: null,
          });
        });

        const simulation = sedDoc?.simulations?.[0];

        switch (simulation?._type) {
          case 'SedUniformTimeCourseSimulation': {
            const simParametersGroup = this.formGroup.controls
              .uniformTimeCourseSimulationParameters as FormGroup;
            simParametersGroup.controls.initialTime.setValue(
              simulation?.initialTime,
            );
            simParametersGroup.controls.outputStartTime.setValue(
              simulation?.outputStartTime,
            );
            simParametersGroup.controls.outputEndTime.setValue(
              simulation?.outputEndTime,
            );
            simParametersGroup.controls.numberOfSteps.setValue(
              simulation?.numberOfSteps,
            );
            simParametersGroup.controls.step.setValue(
              (simulation?.outputEndTime - simulation?.outputStartTime) /
                simulation?.numberOfSteps,
            );
            break;
          }

          case 'SedOneStepSimulation': {
            const simParametersGroup = this.formGroup.controls
              .oneStepSimulationParameters as FormGroup;
            simParametersGroup.controls.step.setValue(simulation?.step);
            break;
          }
        }

        sedDoc?.outputs?.[0].dataSets?.forEach((dataSet: any): void => {
          const modelVar = dataSet.dataGenerator.variables[0];

          modelVar?.target?.namespaces?.forEach((ns: any): void => {
            const prefixKey = ns.prefix || '';
            if (!(prefixKey in nsMap)) {
              this.addModelNamespace();
            }
            nsMap[prefixKey] = {
              prefix: ns?.prefix || null,
              uri: ns.uri,
            };
          });

          this.addModelVariable();
          const varVal = {
            id: modelVar.id,
            name: modelVar?.name || null,
            type: modelVar?.symbol
              ? ModelVariableType.symbol
              : ModelVariableType.target,
            symbolOrTarget: modelVar?.symbol || modelVar?.target?.value,
          };
          varVals.push(varVal);
        });

        const nsVals = Object.values(nsMap).sort((a, b): number => {
          return (a.prefix || '').localeCompare(b.prefix || '', undefined, {
            numeric: true,
          });
        });

        changeVals.sort((a, b): number => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        });

        varVals.sort((a, b): number => {
          if (a.type === b.type) {
            return a.id.localeCompare(b.id, undefined, { numeric: true });
          } else {
            return a.type.localeCompare(b.type, undefined, { numeric: true });
          }
        });

        modelNamespacesArray.setValue(nsVals);
        modelChangesArray.setValue(changeVals);
        modelVariablesArray.setValue(varVals);
      },
    );
    this.modelParametersAndVariablesSubscription =
      modelParametersAndVariablesSubscription;
    this.subscriptions.push(modelParametersAndVariablesSubscription);
  }

  changeModelFormat(): void {
    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;

    const formatEdamId = modelFormatControl.value;

    if (this.allModelingFrameworks && formatEdamId && this.simulatorSpecs) {
      const sboIds = new Set<string>();
      this.simulatorSpecs?.forEach((simulator: SimulatorSpecs): void => {
        simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
          (
            modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
          ): void => {
            if (
              modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.includes(
                formatEdamId,
              )
            ) {
              modelingFrameworksAlgorithmsForModelFormat.frameworkSboIds.forEach(
                (sboId: string): void => {
                  sboIds.add(sboId);
                },
              );
            }
          },
        );
      });

      this.modelingFrameworks = this.allModelingFrameworks.filter(
        (framework: OntologyTerm): boolean => {
          return sboIds.has(framework.id);
        },
      );

      if (this.modelingFrameworks.length === 1) {
        modelingFrameworkControl.setValue(this.modelingFrameworks[0].id);
      } else if (!sboIds.has(modelingFrameworkControl.value)) {
        modelingFrameworkControl.setValue(null);
      }

      modelingFrameworkControl.enable();

      if (sboIds.size === 0) {
        modelFormatControl.setValue(null);
      }
    } else {
      this.modelingFrameworks = undefined;
      modelingFrameworkControl.disable();
      modelingFrameworkControl.setValue(null);
    }

    this.changeModelingFramework();
  }

  changeModelingFramework(): void {
    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;

    const formatEdamId = modelFormatControl.value;
    const frameworkSboId = modelingFrameworkControl.value;

    if (
      this.allSimulationAlgorithms &&
      formatEdamId &&
      frameworkSboId &&
      this.simulatorSpecs
    ) {
      const simulationTypes = new Set<SimulationType>();

      this.simulatorSpecs.forEach((simulator: SimulatorSpecs): void => {
        simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
          (
            modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
          ): void => {
            if (
              modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.includes(
                formatEdamId,
              ) &&
              modelingFrameworksAlgorithmsForModelFormat.frameworkSboIds.includes(
                frameworkSboId,
              )
            ) {
              modelingFrameworksAlgorithmsForModelFormat.simulationTypes.forEach(
                (simulationType: SimulationType): void => {
                  simulationTypes.add(simulationType);
                },
              );
            }
          },
        );
      });

      this.simulationTypes = Array.from(simulationTypes)
        .map((simulationType: SimulationType): OntologyTerm => {
          return {
            id: simulationType,
            name: SimulationTypeName[simulationType].substr(4),
          };
        })
        .sort((a: OntologyTerm, b: OntologyTerm): number => {
          return a.name.localeCompare(b.name, undefined, { numeric: true });
        });

      if (this.simulationTypes.length === 1) {
        simulationTypeControl.setValue(this.simulationTypes[0].id);
      } else if (!simulationTypes.has(simulationTypeControl.value)) {
        simulationTypeControl.setValue(null);
      }

      simulationTypeControl.enable();
      if (this.simulationTypes.length === 0) {
        modelingFrameworkControl.setValue(null);
      }
    } else if (!formatEdamId && frameworkSboId) {
      modelingFrameworkControl.setValue(null);
    } else {
      this.simulationTypes = undefined;
      simulationTypeControl.disable();
      simulationTypeControl.setValue(null);
    }

    this.changeSimulationType();
  }

  changeSimulationType(): void {
    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;
    const simulationAlgorithmControl = this.formGroup.controls
      .simulationAlgorithm as FormControl;

    const formatEdamId = modelFormatControl.value;
    const frameworkSboId = modelingFrameworkControl.value;
    const simulationType: SimulationType | null = simulationTypeControl.value;

    let hasImplementation = false;
    this.simulationTypes?.forEach((simulationTypeObj: OntologyTerm): void => {
      if (simulationType === simulationTypeObj.id) {
        hasImplementation = true;
      }
    });
    if (simulationType && !hasImplementation) {
      simulationTypeControl.setValue(null);
    }

    const oneStepSimulationParametersGroup = this.formGroup.controls
      .oneStepSimulationParameters as FormGroup;
    const uniformTimeCourseSimulationParametersGroup = this.formGroup.controls
      .uniformTimeCourseSimulationParameters as FormGroup;

    if (simulationType === SimulationType.SedOneStepSimulation) {
      oneStepSimulationParametersGroup.enable();
      uniformTimeCourseSimulationParametersGroup.disable();
    } else if (simulationType === SimulationType.SedSteadyStateSimulation) {
      oneStepSimulationParametersGroup.disable();
      uniformTimeCourseSimulationParametersGroup.disable();
    } else if (
      simulationType === SimulationType.SedUniformTimeCourseSimulation
    ) {
      oneStepSimulationParametersGroup.disable();
      uniformTimeCourseSimulationParametersGroup.enable();
    } else {
      oneStepSimulationParametersGroup.disable();
      uniformTimeCourseSimulationParametersGroup.disable();
    }

    if (
      this.allSimulationAlgorithms &&
      formatEdamId &&
      frameworkSboId &&
      simulationType &&
      this.simulatorSpecs
    ) {
      const kisaoIds = new Set<string>();
      this.simulatorSpecs?.forEach((simulator: SimulatorSpecs): void => {
        simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
          (
            modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
          ): void => {
            if (
              modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.includes(
                formatEdamId,
              ) &&
              modelingFrameworksAlgorithmsForModelFormat.frameworkSboIds.includes(
                frameworkSboId,
              ) &&
              modelingFrameworksAlgorithmsForModelFormat.simulationTypes.includes(
                simulationType,
              )
            ) {
              modelingFrameworksAlgorithmsForModelFormat.algorithmKisaoIds.forEach(
                (kisaoId: string): void => {
                  kisaoIds.add(kisaoId);
                },
              );
            }
          },
        );
      });

      this.simulationAlgorithms = this.allSimulationAlgorithms.filter(
        (algorithm: OntologyTerm): boolean => {
          return kisaoIds.has(algorithm.id);
        },
      );

      if (this.simulationAlgorithms.length === 1) {
        simulationAlgorithmControl.setValue(this.simulationAlgorithms[0].id);
      } else if (!kisaoIds.has(simulationAlgorithmControl.value)) {
        simulationAlgorithmControl.setValue(null);
      }

      simulationAlgorithmControl.enable();
    } else {
      this.simulationAlgorithms = undefined;
      simulationAlgorithmControl.disable();
      simulationAlgorithmControl.setValue(null);
    }

    this.changeSimulationAlgorithm();
  }

  changeSimulationAlgorithm(): void {
    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelingFrameworkControl = this.formGroup.controls
      .modelingFramework as FormControl;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;
    const simulationAlgorithmControl = this.formGroup.controls
      .simulationAlgorithm as FormControl;
    const simulationAlgorithmParametersArray = this.formGroup.controls
      .simulationAlgorithmParameters as FormArray;

    const formatEdamId = modelFormatControl.value;
    const frameworkSboId = modelingFrameworkControl.value;
    const simulationType = simulationTypeControl.value as SimulationType;
    const algKisaoId = simulationAlgorithmControl.value;

    let hasImplementation = false;
    const allParams: {
      [id: string]: MultipleSimulatorsAlgorithmParameter;
    } = {};

    this.simulatorSpecs?.forEach((simulator: SimulatorSpecs): void => {
      simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
        (
          modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
        ): void => {
          if (
            modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.includes(
              formatEdamId,
            ) &&
            modelingFrameworksAlgorithmsForModelFormat.frameworkSboIds.includes(
              frameworkSboId,
            ) &&
            modelingFrameworksAlgorithmsForModelFormat.algorithmKisaoIds.includes(
              algKisaoId,
            )
          ) {
            hasImplementation = true;
            modelingFrameworksAlgorithmsForModelFormat.parameters.forEach(
              (param: AlgorithmParameter): void => {
                const allParam = allParams?.[param.id];
                if (allParam) {
                  allParam.simulators.add(simulator.id);
                  if (allParam.type !== param.type) {
                    allParam.type = '--multiple--';
                  }
                  if (allParam.formattedValue !== param.formattedValue) {
                    allParam.value = '--multiple--';
                    allParam.formattedValue = '--multiple--';
                  }
                  if (
                    allParam.formattedRecommendedRangeJoined !==
                    param.formattedRecommendedRangeJoined
                  ) {
                    allParam.recommendedRange = '--multiple--';
                    allParam.formattedRecommendedRange = '--multiple--';
                    allParam.formattedRecommendedRangeJoined = '--multiple--';
                  }
                } else {
                  allParams[param.id] = {
                    id: param.id,
                    name: param.name,
                    url: param.url,
                    simulators: new Set<string>([simulator.id]),
                    type: param.type,
                    value: param.value,
                    formattedValue: param.formattedValue,
                    recommendedRange: param.recommendedRange,
                    formattedRecommendedRange: param.formattedRecommendedRange,
                    formattedRecommendedRangeJoined:
                      param.formattedRecommendedRangeJoined,
                  };
                }
              },
            );
          }
        },
      );
    });

    if (
      algKisaoId &&
      (!formatEdamId ||
        !frameworkSboId ||
        !simulationType ||
        !hasImplementation)
    ) {
      simulationAlgorithmControl.setValue(null);
    }

    simulationAlgorithmParametersArray.clear();

    Object.values(allParams)
      .sort(
        (
          a: MultipleSimulatorsAlgorithmParameter,
          b: MultipleSimulatorsAlgorithmParameter,
        ): number => {
          return a.name.localeCompare(b.name, undefined, { numeric: true });
        },
      )
      .forEach((param: MultipleSimulatorsAlgorithmParameter): void => {
        simulationAlgorithmParametersArray.push(
          this.formBuilder.group(
            {
              id: [param.id],
              name: [param.name],
              url: [param.url],
              simulators: param.simulators,
              simulatorsStr: [Array.from(param.simulators).sort().join(', ')],
              type: [param.type],
              value: [param.value],
              formattedValue: [param.formattedValue],
              recommendedRange: [param.recommendedRange],
              formattedRecommendedRange: [param.formattedRecommendedRange],
              formattedRecommendedRangeJoined: [
                param.formattedRecommendedRangeJoined,
              ],
              newValue: [''],
            },
            {
              validators: [this.parameterValidator],
            },
          ),
        );
      });

    this.getModelParametersAndVariables();
  }

  private setIntersection(a: Set<string>, b: Set<string>): Set<string> {
    const _intersection = new Set<string>();
    for (const elem of b) {
      if (a.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }

  addModelNamespace(): void {
    const modelNamespacesArray = this.formGroup.controls
      .modelNamespaces as FormArray;
    modelNamespacesArray.push(
      this.formBuilder.group({
        prefix: [null, [this.namespacePrefixValidator]],
        uri: [null, [this.urlValidator]],
      }),
    );
  }

  removeModelNamespace(iNamespace: number): void {
    const modelNamespacesArray = this.formGroup.controls
      .modelNamespaces as FormArray;
    modelNamespacesArray.removeAt(iNamespace);
  }

  addModelChange(): void {
    const modelChangesArray = this.formGroup.controls.modelChanges as FormArray;
    const modelChange = this.formBuilder.group({
      id: [null, [this.sedmlIdValidator]],
      name: [null, []],
      target: [null, [Validators.required]],
      default: [null, []],
      newValue: [null, []],
    });
    modelChange.controls.default.disable();
    modelChangesArray.push(modelChange);
  }

  removeModelChange(iChange: number): void {
    const modelChangesArray = this.formGroup.controls.modelChanges as FormArray;
    modelChangesArray.removeAt(iChange);
  }

  addModelVariable(): void {
    const modelVariablesArray = this.formGroup.controls
      .modelVariables as FormArray;
    modelVariablesArray.push(
      this.formBuilder.group({
        id: [null, [this.sedmlIdValidator]],
        name: [null],
        type: [ModelVariableType.target, Validators.required],
        symbolOrTarget: [null, Validators.required],
      }),
    );
  }

  removeModelVariable(iVariable: number): void {
    const modelVariablesArray = this.formGroup.controls
      .modelVariables as FormArray;
    modelVariablesArray.removeAt(iVariable);
  }

  ngOnInit(): void {
    const simulatorsDataObs = this.dispatchService.getSimulatorsFromDb(false);
    const algorithmSubObs = simulatorsDataObs.pipe(
      map(
        (
          simulatorsData: SimulatorsData,
        ): Observable<AlgorithmSubstitution[] | undefined> => {
          return this.combineService.getSimilarAlgorithms(
            Object.keys(simulatorsData.simulationAlgorithms),
          );
        },
      ),
      concatAll(),
      withLatestFrom(simulatorsDataObs, this.route.queryParams),
    );

    const algorithmSubSubcription = algorithmSubObs.subscribe(
      (
        observerableValues: [
          AlgorithmSubstitution[] | undefined,
          SimulatorsData,
          Params,
        ],
      ): void => {
        if (!observerableValues[0]) {
          this.snackBar.open(
            'Sorry! We were unable to load information about the simularity among algorithms.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
        }
        // TODO set typing and refactor. TS will not catch the type errors here
        const algSubstitutions = (observerableValues[0] ||
          []) as AlgorithmSubstitution[];
        const simulatorsData = observerableValues[1] as SimulatorsData;
        const queryParams = observerableValues[2] as Params;

        this.simulatorSpecsMap = simulatorsData.simulatorSpecs;
        this.simulatorSpecs = Object.values(simulatorsData.simulatorSpecs);
        const algSubstitutionsMap: any = {};
        algSubstitutions
          .filter((algSubstitution: AlgorithmSubstitution): boolean => {
            return (
              algSubstitution.maxPolicy.level <=
              AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK
            );
          })
          .forEach((algSubstitution: AlgorithmSubstitution): void => {
            algSubstitutionsMap[
              algSubstitution.algorithms[0].id +
                '/' +
                algSubstitution.algorithms[1].id
            ] = algSubstitution.maxPolicy;
          });
        this.algSubstitutions = algSubstitutionsMap;

        this.allModelFormats = Object.values(simulatorsData.modelFormats).map(
          (format: any): OntologyTerm => {
            return {
              id: format.id,
              name: format.name,
            };
          },
        );
        this.allModelingFrameworks = Object.values(
          simulatorsData.modelingFrameworks,
        ).map((framework: any): OntologyTerm => {
          return {
            id: framework.id,
            name: framework.name,
          };
        });
        this.allSimulationAlgorithms = Object.values(
          simulatorsData.simulationAlgorithms,
        ).map((algorithm: any): OntologyTerm => {
          return {
            id: algorithm.id,
            name: algorithm.name,
          };
        });

        this.simulatorSpecs?.sort(
          (a: SimulatorSpecs, b: SimulatorSpecs): number => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          },
        );
        this.allModelFormats?.sort(
          (a: OntologyTerm, b: OntologyTerm): number => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          },
        );
        this.allModelingFrameworks?.sort(
          (a: OntologyTerm, b: OntologyTerm): number => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          },
        );
        this.allSimulationAlgorithms?.sort(
          (a: OntologyTerm, b: OntologyTerm): number => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          },
        );

        // setup model formats
        const formatEdamIds = new Set<string>();
        this.simulatorSpecs?.forEach((simulator: SimulatorSpecs): void => {
          simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(
            (
              modelingFrameworksAlgorithmsForModelFormat: ModelingFrameworksAlgorithmsForModelFormat,
            ): void => {
              modelingFrameworksAlgorithmsForModelFormat.formatEdamIds.forEach(
                (formatEdamId: string): void => {
                  formatEdamIds.add(formatEdamId);
                },
              );
            },
          );
        });
        this.modelFormats = this.allModelFormats.filter(
          (format: OntologyTerm): boolean => {
            return (
              formatEdamIds.has(format.id) &&
              MODEL_FORMAT_EDAM_ID_MAP[format.id].introspectionAvailable
            );
          },
        );

        // get references to controls
        const modelLocationTypeControl = this.formGroup.controls
          .modelLocationType as FormControl;
        const modelFormatControl = this.formGroup.controls
          .modelFormat as FormControl;
        const modelingFrameworkControl = this.formGroup.controls
          .modelingFramework as FormControl;
        const simulationTypeControl = this.formGroup.controls
          .simulationType as FormControl;
        const simulationAlgorithmControl = this.formGroup.controls
          .simulationAlgorithm as FormControl;

        // Enable model format select menu
        modelFormatControl.enable();

        // set value of form based on query arguments
        const modelUrl = queryParams?.modelUrl;
        if (modelUrl) {
          modelLocationTypeControl.setValue(LocationType.url);
          const modelLocationDetailsControl = this.formGroup.controls
            .modelLocationDetails as FormControl;
          modelLocationDetailsControl.setValue(modelUrl);
        }

        let modelFormat = queryParams?.modelFormat;
        if (modelFormat) {
          modelFormat = modelFormat.toLowerCase();
          const match = modelFormat.match(/^(format[:_])?(\d{1,4})$/);
          if (match) {
            modelFormat =
              'format_' + '0'.repeat(4 - match[2].length) + match[2];
          }
          modelFormatControl.setValue(modelFormat);
        }

        let modelingFramework = queryParams?.modelingFramework;
        if (modelingFramework) {
          modelingFramework = modelingFramework.toUpperCase();
          const match = modelingFramework.match(/^(SBO[:_])?(\d{1,7})$/);
          if (match) {
            modelingFramework =
              'SBO_' + '0'.repeat(7 - match[2].length) + match[2];
          }
          modelingFrameworkControl.setValue(modelingFramework);
        }

        let simulationType = queryParams?.simulationType;
        if (simulationType) {
          if (!simulationType.startsWith('Sed')) {
            simulationType = 'Sed' + simulationType;
          }
          if (!simulationType.endsWith('Simulation')) {
            simulationType = simulationType + 'Simulation';
          }

          this.allSimulationTypes.forEach((simType: OntologyTerm): void => {
            if (simulationType.toLowerCase() == simType.id.toLowerCase()) {
              simulationType = simType.id;
            }
          });

          simulationTypeControl.setValue(simulationType);
        }

        let simulationAlgorithm = queryParams?.simulationAlgorithm;
        if (simulationAlgorithm) {
          simulationAlgorithm = simulationAlgorithm.toUpperCase();
          const match = simulationAlgorithm.match(/^(KISAO[:_])?(\d{1,7})$/);
          if (match) {
            simulationAlgorithm =
              'KISAO_' + '0'.repeat(7 - match[2].length) + match[2];
          }
          simulationAlgorithmControl.setValue(simulationAlgorithm);
        }

        // clear errors
        this.formGroup.setErrors(null);
      },
    );
    this.subscriptions.push(algorithmSubSubcription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe(),
    );
  }

  onFormSubmit(postCreateAction: PostCreateAction): void {
    this.submitPushed = true;

    this.formGroup.updateValueAndValidity();

    if (!this.formGroup.valid) {
      return;
    }

    this.projectBeingCreated = true;

    const formData = new FormData();
    const archiveSpecs = this.getArchiveSpecs();
    const options: any = {};
    formData.append('specs', JSON.stringify(archiveSpecs));
    if (this.formGroup.value.modelLocationType === LocationType.file) {
      formData.append('files', this.formGroup.value.modelLocationDetails);
    }

    const url = `${urls.combineApi}combine/create`;
    const projectOrUrl: Observable<string | any> = this.http
      .post<string>(url, formData, options)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<string> => {
          console.error(error);
          this.snackBar.open(
            'Sorry! We were unable to generate your COMBINE/OMEX archive.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
          return of<string>('');
        }),
      );
    const projectOrUrlSub = projectOrUrl.subscribe(
      (projectOrUrl: string | any): void => {
        if (projectOrUrl) {
          this.processCreatedCombineArchive(postCreateAction, projectOrUrl);
        }
      },
    );
    this.subscriptions.push(projectOrUrlSub);
  }

  private getArchiveSpecs(): any {
    const modelFormatControl = this.formGroup.controls
      .modelFormat as FormControl;
    const modelNamespacesArray = this.formGroup.controls
      .modelNamespaces as FormArray;
    const modelChangesArray = this.formGroup.controls.modelChanges as FormArray;
    const simulationTypeControl = this.formGroup.controls
      .simulationType as FormControl;
    const simulationAlgorithmControl = this.formGroup.controls
      .simulationAlgorithm as FormControl;
    const simulationAlgorithmParametersArray = this.formGroup.controls
      .simulationAlgorithmParameters as FormArray;
    const modelVariablesArray = this.formGroup.controls
      .modelVariables as FormArray;

    const model: any = {
      _type: 'SedModel',
      id: 'model',
      language: MODEL_FORMAT_EDAM_ID_MAP[modelFormatControl.value].sedUrn,
      source:
        'model.' +
        MODEL_FORMAT_EDAM_ID_MAP[modelFormatControl.value].extensions?.[0],
      changes: [],
    };

    const simulation: any = {
      _type: simulationTypeControl.value,
      id: 'simulation',
    };
    if (simulation._type === SimulationType.SedOneStepSimulation) {
      const oneStepSimulationParametersGroup = this.formGroup.controls
        .oneStepSimulationParameters as FormGroup;
      simulation['step'] = oneStepSimulationParametersGroup.controls.step.value;
    } else if (
      simulation._type === SimulationType.SedUniformTimeCourseSimulation
    ) {
      const uniformTimeCourseSimulationParametersGroup = this.formGroup.controls
        .uniformTimeCourseSimulationParameters as FormGroup;
      simulation['initialTime'] =
        uniformTimeCourseSimulationParametersGroup.controls.initialTime.value;
      simulation['outputStartTime'] =
        uniformTimeCourseSimulationParametersGroup.controls.outputStartTime.value;
      simulation['outputEndTime'] =
        uniformTimeCourseSimulationParametersGroup.controls.outputEndTime.value;
      simulation['numberOfSteps'] =
        uniformTimeCourseSimulationParametersGroup.controls.numberOfSteps.value;
    }
    simulation['algorithm'] = {
      _type: 'SedAlgorithm',
      kisaoId: simulationAlgorithmControl.value,
      changes: simulationAlgorithmParametersArray.value
        .filter((param: any): boolean => {
          return !!param.newValue;
        })
        .map((param: any) => {
          let newValue = param.newValue;
          if (
            param.type === ValueType.kisaoId &&
            param.recommendedRange &&
            param.recommendedRange !== '--multiple--'
          ) {
            const iValue = param.formattedRecommendedRange.indexOf(newValue);
            newValue = param.recommendedRange[iValue];
          }

          return {
            _type: 'SedAlgorithmParameterChange',
            kisaoId: param.id,
            newValue: newValue,
          };
        }),
    };

    const task = {
      _type: 'SedTask',
      id: 'task',
      model: model,
      simulation: simulation,
    };

    const dataGenerators: any[] = [];
    const dataSets: any[] = [];

    const targetNamespaces = modelNamespacesArray.controls.map(
      (control: AbstractControl): void => {
        const ns = control.value;
        const nsObj: any = {
          _type: 'Namespace',
          uri: ns.uri,
        };
        if (ns.prefix) {
          nsObj['prefix'] = ns.prefix;
        }
        return nsObj;
      },
    );

    modelChangesArray.controls.forEach((control: AbstractControl): void => {
      const formVar = control.value;
      if (formVar.newValue) {
        const change: any = {
          _type: 'SedModelAttributeChange',
          id: formVar.id,
          target: {
            _type: 'SedTarget',
            value: formVar.target,
            namespaces: targetNamespaces,
          },
          newValue: formVar.newValue,
        };
        if (formVar.name) {
          change['name'] = formVar.name;
        }
        model.changes.push(change);
      }
    });

    modelVariablesArray.controls.forEach((control: AbstractControl): void => {
      const formVar = control.value;
      const sedVar: any = {
        _type: 'SedVariable',
        id: 'variable_' + (formVar.id as string),
        task: task,
      };
      if (formVar.name) {
        sedVar['name'] = formVar.name;
      }
      if (formVar.type === ModelVariableType.symbol) {
        sedVar['symbol'] = formVar.symbolOrTarget;
      } else {
        sedVar['target'] = {
          _type: 'SedTarget',
          value: formVar.symbolOrTarget,
          namespaces: targetNamespaces,
        };
      }

      const dataGen: any = {
        _type: 'SedDataGenerator',
        id: 'data_generator_' + formVar.id,
        variables: [sedVar],
        math: sedVar.id,
      };
      if (formVar.name) {
        dataGen['name'] = formVar.name;
      }
      dataGenerators.push(dataGen);

      const dataSet: any = {
        _type: 'SedDataSet',
        id: formVar.id,
        label: formVar.name || formVar.id,
        dataGenerator: dataGen,
      };
      if (formVar.name) {
        dataSet['name'] = formVar.name;
      }
      dataSets.push(dataSet);
    });

    const sedDoc = {
      _type: 'SedDocument',
      level: 1,
      version: 3,
      models: [model],
      simulations: [simulation],
      tasks: [task],
      dataGenerators: dataGenerators,
      outputs: [
        {
          _type: 'SedReport',
          id: 'report',
          dataSets: dataSets,
        },
      ],
    };

    let modelContent: any = {};
    if (this.formGroup.value.modelLocationType === LocationType.file) {
      modelContent = {
        _type: 'CombineArchiveContentFile',
        filename: this.formGroup.value.modelLocationDetails.name,
      };
    } else {
      modelContent = {
        _type: 'CombineArchiveContentUrl',
        url: this.formGroup.value.modelLocationDetails,
      };
    }

    return {
      _type: 'CombineArchive',
      contents: [
        {
          _type: 'CombineArchiveContent',
          format:
            MODEL_FORMAT_EDAM_ID_MAP[modelFormatControl.value].combineUris[0],
          master: false,
          location: {
            _type: 'CombineArchiveLocation',
            path: model.source,
            value: modelContent,
          },
        },
        {
          _type: 'CombineArchiveContent',
          format: 'http://identifiers.org/combine.specifications/sed-ml',
          master: true,
          location: {
            _type: 'CombineArchiveLocation',
            path: 'simulation.sedml',
            value: sedDoc,
          },
        },
      ],
    };
  }

  private processCreatedCombineArchive(
    postCreateAction: PostCreateAction,
    projectOrUrl: string | any,
  ): void {
    this.projectBeingCreated = false;

    if (postCreateAction === 'simulate') {
      const modelFormat: string = this.formGroup.value.modelFormat;
      const modelingFramework: string = this.formGroup.value.modelingFramework;
      const simulationAlgorithm: string =
        this.formGroup.value.simulationAlgorithm;

      this.router.navigate(['/run'], {
        queryParams: {
          projectUrl: projectOrUrl,
          modelFormat: modelFormat,
          modelingFramework: modelingFramework,
          simulationAlgorithm: simulationAlgorithm,
        },
      });
    } else {
      const a = document.createElement('a');
      a.href = projectOrUrl;
      a.download = 'project.omex';
      a.click();
    }
  }

  private formSectionOpen = {
    modelNamespaces: new BehaviorSubject<boolean>(false),
    modelChanges: new BehaviorSubject<boolean>(false),
    modelVariables: new BehaviorSubject<boolean>(false),
    simulationAlgorithmParameters: new BehaviorSubject<boolean>(false),
  };
  formSectionOpen$ = {
    modelNamespaces: this.formSectionOpen.modelNamespaces.asObservable(),
    modelChanges: this.formSectionOpen.modelChanges.asObservable(),
    modelVariables: this.formSectionOpen.modelVariables.asObservable(),
    simulationAlgorithmParameters:
      this.formSectionOpen.simulationAlgorithmParameters.asObservable(),
  };
  toggleFormSection(
    name:
      | 'modelNamespaces'
      | 'modelChanges'
      | 'modelVariables'
      | 'simulationAlgorithmParameters',
  ): void {
    this.formSectionOpen[name].next(!this.formSectionOpen[name].value);
  }
}
