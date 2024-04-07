import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Endpoints } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CreateArchive } from '../../../service/create-project/archive-creation';
import { MultipleSimulatorsAlgorithmParameter } from '../../../service/create-project/compatibility';
import { FormStepData } from './forms';
import { SimulationType } from '@biosimulations/datamodel/common';
import { CreateProjectDataSource, CreateProjectFormStep } from './create-project-data-source';
import { Namespace } from '@biosimulations/combine-api-angular-client';

/**
 * Creates parameters that can be used to launch the /runs/new endpoint configured to simulate
 * the newly created project. Returns null if the dataSource's formData is invalid.
 *
 * @param dataSource The datasource for the form used to create the new project.
 * @param projectUrl The url of the created project.
 */
export function CreateSimulationParams(
  dataSource: CreateProjectDataSource,
  projectUrl: string,
): Record<string, string> | null {
  const uploadData = dataSource.formData[CreateProjectFormStep.UploadModel];
  const simMethodData = dataSource.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
  if (!uploadData || !simMethodData) {
    return null;
  }
  const params = {
    projectUrl: projectUrl,
    simulator: '',
    simulatorVersion: '',
    runName: '',
    modelFormat: uploadData.modelFormat as string,
    modelingFramework: simMethodData.framework as string,
    simulationAlgorithm: simMethodData.algorithm as string,
  };

  if (dataSource.reRunSimulator && dataSource.reRunSimulatorVersion && dataSource.reRunName) {
    params.simulator = dataSource.reRunSimulator;
    params.simulatorVersion = dataSource.reRunSimulatorVersion;
    params.runName = 'customized-' + dataSource.reRunName;
  }

  return params;
}

/**
 * Creates and posts a request to the archive creation endpoint using the data within dataSource.
 * Returns null if a valid request cannot be created with the provided data source's form data. Otherwise
 * returns an observable that will complete on post success.
 *
 * @param dataSource The data source for the CreateProject form.
 * @param http An http client to use for posting the request.
 * @param errorHandler An error handler that will be called if the post fails.
 */

export function SubmitFormData(
  dataSource: CreateProjectDataSource,
  http: HttpClient,
  errorHandler: () => void,
): Observable<string> | null | void | string | any {
  const formData = CreateSubmissionFormData(dataSource);

  if (!formData) {
    console.log(`There is no form data. Returning null.`);
    return null;
  }
  const endpoints = new Endpoints();
  const createArchiveUrl = endpoints.getCombineArchiveCreationEndpoint(false);

  const headers = new HttpHeaders();
  headers.append('Accept', 'application/json');
  const httpOptions = {
    headers: headers,
  };

  return http.post<string>(createArchiveUrl, formData, httpOptions).pipe(
    catchError((error: HttpErrorResponse): Observable<string> => {
      console.error(error);
      errorHandler();
      return of<string>(`${error}`);
    }),
  );
}

export function SubmitFormDataForArchive(
  dataSource: CreateProjectDataSource,
  errorHandler: () => void,
): Promise<string | null> {
  const formData = CreateSubmissionFormData(dataSource);

  if (!formData) {
    console.log(`There is no form data. Returning null.`);
    return Promise.resolve(null);
  }

  const createArchiveUrl = 'https://combine.api.biosimulations.dev/combine/create';
  const headers = {
    Accept: 'application/json',
  };

  return fetch(createArchiveUrl, {
    method: 'POST',
    body: formData,
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      console.log(`Generated URL: ${url}`);
      return url;
    })
    .catch((error) => {
      console.error('Error:', error);
      errorHandler();
      return null;
    });
}

function CreateSubmissionFormData(dataSource: CreateProjectDataSource): FormData | null {
  const uploadModelData: FormStepData = dataSource.formData[CreateProjectFormStep.UploadModel];
  const simulationMethodData: FormStepData = dataSource.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
  const algorithmParamData: FormStepData = dataSource.formData[CreateProjectFormStep.AlgorithmParameters];
  const timeCourseData: FormStepData = dataSource.formData[CreateProjectFormStep.UniformTimeCourseSimulationParameters];
  const modelChangesData: FormStepData = dataSource.formData[CreateProjectFormStep.ModelChanges];
  const variablesData: FormStepData = dataSource.formData[CreateProjectFormStep.Observables];
  const namespacesData: FormStepData = dataSource.formData[CreateProjectFormStep.ModelNamespace];

  // AlgorithmParameters and UniformTimeCourseSimulationParameters are conditional steps, so their data may be null.
  if (!uploadModelData || !simulationMethodData || !modelChangesData || !variablesData || !namespacesData) {
    return null;
  }

  const archive = CreateArchive(
    uploadModelData.modelFormat as string,
    uploadModelData.modelUrl as string,
    uploadModelData.modelFile as File,
    simulationMethodData.algorithm as string,
    simulationMethodData.simulationType as SimulationType,
    timeCourseData?.initialTime as number,
    timeCourseData?.outputStartTime as number,
    timeCourseData?.outputEndTime as number,
    timeCourseData?.numberOfSteps as number,
    algorithmParamData?.algorithmParameters as Record<string, MultipleSimulatorsAlgorithmParameter>,
    modelChangesData.modelChanges as Record<string, string>[],
    variablesData.modelVariables as Record<string, string>[],
    namespacesData.namespaces as Namespace[],
    dataSource.reRunMetadataFileUrl as string,
    dataSource.reRunSedFileUrl as string,
    dataSource.reRunModelId as string,
  );

  if (!archive) {
    return null;
  }

  const formData = new FormData();
  formData.append('specs', JSON.stringify(archive));
  formData.append('download', 'true');

  const modelFile = uploadModelData.modelFile as File;
  if (modelFile) {
    formData.append('files', modelFile);
  }
  return formData;
}
