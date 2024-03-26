import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SimulationType } from '@biosimulations/datamodel/common';
import {
  SedModelChange,
  SedModelAttributeChangeTypeEnum,
  SedVariable,
  SedUniformTimeCourseSimulation,
  Namespace,
  SedDocument,
  SedOutput,
  SedReportTypeEnum,
  SedReport,
  SedDataGenerator,
  SedDataSet,
  SedUniformTimeCourseSimulationTypeEnum,
} from '@biosimulations/combine-api-angular-client';
import { Endpoints } from '@biosimulations/config/common';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { environment } from '@biosimulations/shared/environments';

export type FormStepData = Record<string, unknown>;

export interface CustomizableSedDocumentData {
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation;
  namespaces: Namespace[];
}

export interface SimMethodData extends FormStepData {
  simulationType?: SimulationType;
  algorithm?: string;
  framework?: string;
}

export interface ModelData extends FormStepData {
  modelFormat: string;
  modelFile: Blob;
  modelUrl: string;
  modelChanges?: SedModelChange[];
}

export interface CustomSimulationDatasource {
  simMethodData: SimMethodData;
  modelData: ModelData;
  introspectedData?: CustomizableSedDocumentData | null;
}

const UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR = function (attrName: string): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    const values = control.value;

    const attributes = values.map((value: any): string => {
      return value?.[attrName];
    });

    const uniqueValues = new Set<string>(attributes);
    if (uniqueValues.size === values.length) {
      return null;
    }

    const error: ValidationErrors = {};
    error[attrName + 'Unique'] = true;
    return error;
  };
};

const SEDML_ID_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const idPattern = /^[a-z_][a-z0-9_]+$/i;
  const value = control.value;
  if (value && control.value.match(idPattern)) {
    return null;
  }
  return { validSedmlId: true };
};

@Component({
  selector: 'biosimulations-run-custom-simulation',
  templateUrl: './run-custom-simulation.component.html',
  styleUrls: ['./run-custom-simulation.component.scss'],
})
export class RunCustomSimulationComponent implements OnInit, OnChanges {
  public formGroup: UntypedFormGroup;
  public introspectionData$?: Observable<CustomizableSedDocumentData | null>;
  //public introspectedData?: CustomizableSedDocumentData;
  public formArray: UntypedFormArray;
  public nextClicked = false;
  public isReRun = false;
  public constructor(private formBuilder: UntypedFormBuilder, private httpClient: HttpClient) {
    this.formGroup = this.formBuilder.group({
      projectUrl: ['', []],
      modelSource: ['', []],
      modelFormats: ['', []],
      simulationAlgorithms: ['', []],
      simType: ['', []],
      formArray: this.formBuilder.array([], {
        validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
      }),
    });
    this.formArray = this.formGroup.get('formArray') as UntypedFormArray;
  }

  public ngOnInit() {
    this.addDefaultFields();

    // 1. Set the datasource (CustomSimulationDataSource) by deriving vals from reRunProject query params
    // 2. set this.introspectedData$ = this.introspectionProvider(customDataSource) , coming from file.
    // 3. simply then call this.populateModelChangesForm
  }

  public ngOnChanges(changes: SimpleChanges) {
    /* TODO: Extract changes from sharedFormArray here */
  }

  private addDefaultFields(): void {
    /* Set placeholder fields on init */
    const defaultRowCount = 3;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelChangeField();
    }
  }

  private introspectionProvider(dataSource: CustomSimulationDatasource): Observable<void> | null {
    const errorHandler = this.showIntrospectionFailedSnackbar.bind(this);
    const formatData = dataSource?.modelData;
    const simMethodData = dataSource?.simMethodData;
    const introspectionObservable = IntrospectNewProject(this.httpClient, formatData, simMethodData, errorHandler);
    console.log(`INTROSPECTION PROVIDER EVOKED IN CREATE PROJECT: ${introspectionObservable}`);
    if (!introspectionObservable) {
      return null;
    }
    return introspectionObservable.pipe(
      map((introspectionData: CustomizableSedDocumentData | null) => {
        if (introspectionData) {
          dataSource.introspectedData = introspectionData;
        }
      }),
    );
  }

  private populateModelChangesForm(): void {
    // remember that here the introspection comes from the model changes
    this.introspectionData$?.subscribe((introspection: CustomizableSedDocumentData | null) => {
      const introspectedChanges: SedModelChange[] | undefined = introspection?.modelChanges;
      if (introspectedChanges) {
        this.loadIntrospectedModelChanges(introspectedChanges);
        console.log(introspectedChanges);
      }
    });
  }

  /**
   * Preloads any model changes parsed out of the uploaded SedDocument into the form.
   * @param introspectedModelChanges SedModelChange instances parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedModelChanges(introspectedModelChanges: SedModelChange[]): void {
    if (introspectedModelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    introspectedModelChanges.forEach((change: SedModelChange) => {
      this.addFieldForModelChange(change);
    });
  }

  /**
   * Loads any previously entered data back into the form. This will be called immediately before the
   * form step appears. Edited fields will overwrite model changes loaded via introspection.
   * @param formStepData Data containing the previously entered model changes.
   */
  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelChanges = formStepData.modelChanges as Record<string, string>[];
    if (!modelChanges || modelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    modelChanges.forEach((modelChange: Record<string, string>): void => {
      this.addModelChangeField(modelChange);
    });
  }

  public getFormStepData(): FormStepData | null {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return null;
    }
    const modelChanges: Record<string, string>[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as UntypedFormGroup;
      modelChanges.push({
        id: formGroup.value.id,
        name: formGroup.value.name,
        newValue: formGroup.value.newValue,
        target: formGroup.value.target,
        default: formGroup.controls.default.value,
      });
    });
    return {
      modelChanges: modelChanges,
    };
  }

  public removeModelChangeField(index: number): void {
    this.formArray.removeAt(index);
  }

  public formGroups(): UntypedFormGroup[] {
    return this.formArray.controls as UntypedFormGroup[];
  }

  public shouldShowIdError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('validSedmlId', 'id');
  }

  public shouldShowTargetError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('required', 'target');
  }

  public addModelChangeField(modelChange?: Record<string, string | null>): void {
    const modelChangeForm = this.formBuilder.group({
      id: [modelChange?.id, [SEDML_ID_VALIDATOR]],
      name: [modelChange?.name, []],
      target: [modelChange?.target, [Validators.required]],
      default: [modelChange?.default, []],
      newValue: [modelChange?.newValue, []],
    });
    modelChangeForm.controls.default.disable();
    this.formArray.push(modelChangeForm);
  }

  private addFieldForModelChange(modelChange: SedModelChange): void {
    // TODO: Support additional change types.
    if (modelChange && modelChange._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      return;
    }
    this.addModelChangeField({
      id: modelChange.id || null,
      name: modelChange.name || null,
      target: modelChange.target.value || null,
      default: modelChange.newValue || null,
      newValue: null,
    });
  }

  /*public archiveSedDocSpecsLoaded(sedDocSpecs?: CombineArchiveSedDocSpecs): void {
    const modelFormats = new Set<string>();
    const modelSource: string[] = [];
    const simType: string[] = [];
    const simulationAlgorithms = new Set<string>();
    let specsContainUnsupportedModel = false;
    let specsContainUnsupportedAlgorithm = false;

    //  VALIDATE: Confirm that every model and algorithm within the sed doc spec is supported.
    sedDocSpecs?.contents.forEach((content: CombineArchiveSedDocSpecsContent, contentIndex: number): void => {
      const sedDoc: SedDocument = content.location.value;
      //this.loadData(sedDoc);
      sedDoc.models.forEach((model: SedModel, modelIndex: number): void => {
        let edamId: string | null = null;
        for (const modelingFormat of BIOSIMULATIONS_FORMATS) {
          const sedUrn = modelingFormat?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
          if (!sedUrn || !modelingFormat.id || !model.language.startsWith(sedUrn)) {
            continue;
          }
          edamId = modelingFormat.id;
        }
        if (edamId) {
          modelFormats.add(edamId);
        } else {
          specsContainUnsupportedModel = true;
        }
        // set model source for project introspection
        modelSource.push(model.source);
      });
      // SET SIMULATION ALGS
      sedDoc.simulations.forEach((sim: SedSimulation): void => {
        const kisaoId = sim.algorithm.kisaoId;
        if (kisaoId in simulationAlgorithmsMap) {
          simulationAlgorithms.add(kisaoId);
        } else {
          specsContainUnsupportedAlgorithm = true;
        }
        simType.push(sim._type);
        // FILL DATA
      });
    });

    this.setUnsupportedModelErrorIsShown(specsContainUnsupportedModel);
    this.setUnsupportedAlgorithmErrorIsShown(specsContainUnsupportedAlgorithm);

    this.formGroup.controls.modelSource.setValue(modelSource);
    this.formGroup.controls.modelFormats.setValue(Array.from(modelFormats));
    this.formGroup.controls.simulationAlgorithms.setValue(Array.from(simulationAlgorithms));
    this.formGroup.controls.simType.setValue(simType);

    this.controlImpactingEligibleSimulatorsUpdated();

    console.log(`THE model FORMATS set in group: ${this.formGroup.get('modelFormats')?.value}`);
    console.log(`The model source set in group: ${this.formGroup.get('modelSource')?.value}`);
    console.log(`THE sims set in group: ${this.formGroup.get('simType')?.value}`);

    console.log(`SED DOCS LOADED`);
  }*/

  private showIntrospectionFailedSnackbar(modelUrl: string): string | undefined {
    let msg =
      'Sorry! We were unable to get the input parameters and output variables of your model. ' +
      'This feature is only currently available for models encoded in BNGL, CellML, SBML, SBML-fbc, ' +
      'SBML-qual, and Smoldyn. Please refresh to try again.';
    if (modelUrl) {
      msg += ` Please check that ${modelUrl} is an accessible URL.`;
      return msg;
    }
  }
}

export function IntrospectNewProject(
  http: HttpClient,
  modelData: FormStepData,
  simMethodData: FormStepData,
  errorHandler: (modelUrl: string) => void,
): Observable<CustomizableSedDocumentData | null> | null {
  const formData = CreateNewProjectFormData(modelData, simMethodData);
  if (!formData) {
    return null;
  }

  console.log(`THE SIM METHOD DATA FROM UTILS PROJECT INTROSPECTION: ${Object.keys(simMethodData)}`);
  console.log(`The framework and type: ${simMethodData.framework}, ${simMethodData.simulationType}`);
  console.log(`THE MODELDATA FROM UTILS PROJECT INTROSPECTION: ${Object.keys(modelData)}`);
  Object.keys(modelData).forEach((p) => {
    console.log(`THE MODEL DATA KEY VALUE: ${modelData[p]}`);
  });
  // console.log(`THE FILE: ${modelData.modelFile?.name}`);
  const modelUrl = modelData?.modelUrl as string;
  const endpoints = new Endpoints();
  const introspectionEndpoint = endpoints.getModelIntrospectionEndpoint(false);
  const introspectionObservable = PostNewProjectSedDocument(
    http,
    introspectionEndpoint,
    formData,
    modelUrl,
    errorHandler,
  );
  return introspectionObservable.pipe(map(CreateNewProjectArchiveDataOperator(simMethodData)));
}

function CreateNewProjectFormData(modelData: FormStepData, simMethodData: FormStepData): FormData | null {
  const modelFormat = modelData?.modelFormat as string;
  const modelFile = modelData?.modelFile as Blob;
  const modelUrl = modelData?.modelUrl as string;
  const frameworkId = simMethodData?.framework as string;
  const simulationType = simMethodData?.simulationType as SimulationType;
  const algorithmId = simMethodData?.algorithm as string;
  if (!modelFormat || (!modelUrl && !modelFile) || !frameworkId || !simulationType || !algorithmId) {
    return null;
  }
  const formData = new FormData();
  if (modelFile) {
    formData.append('modelFile', modelFile);
  } else {
    formData.append('modelUrl', modelUrl);
  }
  const formatData = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat];
  const modelLanguage = formatData?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
  if (modelLanguage) {
    formData.append('modelLanguage', modelLanguage);
  }
  formData.append('modelingFramework', frameworkId);
  formData.append('simulationType', simulationType);
  formData.append('simulationAlgorithm', algorithmId);
  return formData;
}

function PostNewProjectSedDocument(
  http: HttpClient,
  postEndpoint: string,
  formData: FormData,
  modelUrl: string,
  errorHandler: (modelUrl: string) => void,
): Observable<SedDocument | null> {
  return http.post<SedDocument>(postEndpoint, formData).pipe(
    catchError((error: HttpErrorResponse): Observable<null> => {
      if (!environment.production) {
        console.error(error);
      }
      errorHandler(modelUrl);
      return of<null>(null);
    }),
  );
}

function CreateNewProjectArchiveDataOperator(
  simMethodData: FormStepData,
): (doc: SedDocument | null) => CustomizableSedDocumentData | null {
  const simulationType = simMethodData?.simulationType as SimulationType;
  return (sedDoc: SedDocument | null) => {
    return sedDoc ? CreateCustomizableSedDocumentData(sedDoc, simulationType) : null;
  };
}

function CreateCustomizableSedDocumentData(
  sedDoc: SedDocument,
  simulationType: SimulationType,
): CustomizableSedDocumentData {
  const namespaces: Namespace[] = [];
  const modelChanges = GatherModelChanges(sedDoc, namespaces);
  const modelVariables = GatherModelVariables(sedDoc, namespaces);
  const uniformTimeCourseSimulation = GatherTimeCourseData(sedDoc, simulationType);
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

function GatherModelVariables(sedDoc: SedDocument, namespaces: Namespace[]): SedVariable[] {
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
    AddUniqueNamespaces(modelVar.target?.namespaces, namespaces);
  });
  return modelVariables;
}

function GatherModelChanges(sedDoc: SedDocument, namespaces: Namespace[]): SedModelChange[] {
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
    AddUniqueNamespaces(change.target?.namespaces, namespaces);
  });
  changeValues.sort((a, b): number => {
    const aId = a.id || '';
    const bId = b.id || '';
    return aId.localeCompare(bId, undefined, { numeric: true });
  });
  return changeValues;
}

function GatherTimeCourseData(
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

function AddUniqueNamespaces(newNamespaces: Namespace[] | undefined, existingNamespaces: Namespace[]): void {
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
