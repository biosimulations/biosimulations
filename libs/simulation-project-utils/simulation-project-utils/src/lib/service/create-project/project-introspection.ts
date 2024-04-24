import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormStepData } from '../../ui/create-project/create-project/forms';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { Endpoints } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  SedModelChange,
  SedVariable,
  SedUniformTimeCourseSimulation,
  Namespace,
  SedDocument,
  SedReport,
  SedReportTypeEnum,
  SedOutput,
  SedDataGenerator,
  SedDataSet,
  SedModelAttributeChangeTypeEnum,
  SedUniformTimeCourseSimulationTypeEnum,
} from '@biosimulations/combine-api-angular-client';
import { SimulationType } from '@biosimulations/datamodel/common';
import { environment } from '@biosimulations/shared/environments';

/**
 * An object encapsulating the data on a SedDocument that can be customized by the
 * create project form. The values in each field are the values currently set in
 * the introspected SedDocument, and should be preset into fields as defaults.
 */
export interface CustomizableSedDocumentData {
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation;
  namespaces: Namespace[];
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

  const modelUrl = modelData?.modelUrl as string;
  console.log(`The keys of model data for introspection: ${Object.keys(modelData)}`);
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

interface ArchiveFormData {
  modelFormat: string;
  modelFile?: string;
  modelUrl?: string;
  modelLanguage: string;
  modelingFramework: string;
  simulationType: string;
  simulationAlgorithm: string;
}

export function _IntrospectNewProject(
  http: HttpClient,
  formData: FormData,
  modelUrl: string,
  errorHandler: () => void,
): Observable<SedDocument | null> {
  const endpoints = new Endpoints();
  const introspectionEndpoint = endpoints.getModelIntrospectionEndpoint(false);
  return PostNewProjectSedDocument(http, introspectionEndpoint, formData, modelUrl, errorHandler);
}

function CreateNewProjectFormData(
  modelData: FormStepData,
  simMethodData: FormStepData,
): FormData | null | ArchiveFormData {
  const modelFormat = modelData.modelFormat as string;
  const modelFile = modelData?.modelFile as Blob;
  const modelUrl = modelData?.modelUrl as string;
  const frameworkId = simMethodData.framework as string;
  const simulationType = simMethodData.simulationType as SimulationType;
  const algorithmId = simMethodData.algorithm as string;

  console.log(`THE FRAMEWORK ID: ${frameworkId}`);

  if (!modelFormat || (!modelUrl && !modelFile) || !frameworkId || !simulationType || !algorithmId) {
    console.log(`RETURNING....`);
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

  /*const form: ArchiveFormData = {
    modelUrl: modelUrl,
    modelFile: '',
    modelFormat: modelFormat,
    modelLanguage: modelLanguage as string,
    modelingFramework: frameworkId,
    simulationType: simulationType,
    simulationAlgorithm: algorithmId,
  };

  return form;*/
  return formData;
}

export function PostNewProjectSedDocument(
  http: HttpClient,
  postEndpoint: string,
  formData: FormData | ArchiveFormData,
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
