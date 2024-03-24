import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '@biosimulations/shared/environments';
import {
  CombineArchiveSedDocSpecs,
  SedDocument,
  SimulationType,
  Namespace,
  SedDataGenerator,
  SedDataSet,
  SedModelChange,
  SedOutput,
  SedTarget,
  SedAlgorithm,
  SedVariable,
  SedSimulation,
} from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';
import { FormStepData } from '@biosimulations/simulation-project-utils';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';

export interface SedUniformTimeCourseSimulation {
  id: string;
  name?: string;
  _type: SedUniformTimeCourseSimulationTypeEnum;
  initialTime: number;
  outputStartTime: number;
  outputEndTime: number;
  numberOfSteps: number;
  algorithm: SedAlgorithm;
}

export enum SedUniformTimeCourseSimulationTypeEnum {
  SedUniformTimeCourseSimulation = 'SedUniformTimeCourseSimulation',
}

export interface SedModelAttributeChange {
  _type: SedModelAttributeChangeTypeEnum;
  newValue: string;
  target: SedTarget;
  id?: string;
  name?: string;
}
export enum SedModelAttributeChangeTypeEnum {
  SedModelAttributeChange = 'SedModelAttributeChange',
}
export interface SedReport {
  id: string;
  _type: SedReportTypeEnum;
  name?: string;
  dataSets: Array<SedDataSet>;
}

export enum SedReportTypeEnum {
  SedReport = 'SedReport',
}

export interface CustomizableSedDocumentData {
  modelChanges: SedModelChange[] | undefined;
  modelVariables: SedVariable[] | undefined;
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation | undefined;
  namespaces: Namespace[] | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class CombineApiService {
  private endpoints = new Endpoints();

  private sedmlSpecsEndpoint = this.endpoints.getSedmlSpecificationsEndpoint(false);

  public constructor(private http: HttpClient) {}

  public getSpecsOfSedDocsInCombineArchive(
    fileOrUrl: File | string,
  ): Observable<CombineArchiveSedDocSpecs | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    return this.http.post<CombineArchiveSedDocSpecs>(this.sedmlSpecsEndpoint, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<undefined> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<undefined>(undefined);
      }),
      shareReplay(1),
    );
  }

  public getCustomizableSedData(sedDoc: SedDocument, simulationType: SedSimulation): CustomizableSedDocumentData {
    return CreateCustomizableSedDocumentData(
      sedDoc,
      // simulationType
    );
  }

  public introspectProject(
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
    const endpoints = new Endpoints();
    const introspectionEndpoint = endpoints.getModelIntrospectionEndpoint(false);
    const introspectionObservable = PostNewProjectSedDocument(
      http,
      introspectionEndpoint,
      formData,
      modelUrl,
      errorHandler,
    );
    // return introspectionObservable.pipe(map(CreateNewProjectArchiveDataOperator(simMethodData)));
    return introspectionObservable.pipe(map(CreateNewProjectArchiveDataOperator()));
  }

  public postProjectSedDocument(fileOrUrl: File | string): Observable<SedDocument | null> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }
    return this.http.post<SedDocument>(this.sedmlSpecsEndpoint, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<null> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<null>(null);
      }),
    );
  }
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

function CreateNewProjectArchiveDataOperator(): (doc: SedDocument | null) => CustomizableSedDocumentData | null {
// simMethodData: FormStepData,
  // const simulationType = simMethodData?.simulationType as SedSimulation;
  return (sedDoc: SedDocument | null) => {
    // return sedDoc ? CreateCustomizableSedDocumentData(sedDoc, simulationType) : null;
    return sedDoc ? CreateCustomizableSedDocumentData(sedDoc) : null;
  };
}

function CreateCustomizableSedDocumentData(
  sedDoc: SedDocument,
  // simulationType: SedSimulation,
): CustomizableSedDocumentData {
  const namespaces: Namespace[] = [];
  const modelChanges = GatherModelChanges(sedDoc, namespaces);
  // insert changes through outputs
  const modelVariables = GatherModelVariables(sedDoc, namespaces);
  // const uniformTimeCourseSimulation = GatherTimeCourseData(sedDoc, simulationType);
  namespaces.sort((a, b): number => {
    return (a.prefix || '').localeCompare(b.prefix || '', undefined, {
      numeric: true,
    });
  });
  return {
    modelChanges: modelChanges,
    modelVariables: modelVariables,
    // uniformTimeCourseSimulation: uniformTimeCourseSimulation,
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
    const modelVar: SedVariable = dataGeneratorsMap[dataSet.dataGenerator.id].variables[0];
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

function GatherTimeCourseData(sedDoc: SedDocument, simType: SedSimulation): SedUniformTimeCourseSimulation | undefined {
  const simulation = sedDoc?.simulations?.[0];
  /*if (simType as SimulationType) {
    const selectedType = simType !== SimulationType.SedUniformTimeCourseSimulation;
    const docType = simulation?._type === SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation;
    if (!selectedType || !docType) {
      return undefined;
    }
  }*/
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
