import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Endpoints } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    console.log(`not valid.`);
    return null;
  }
  console.log(`the project url in params form: ${projectUrl}`);
  return {
    projectUrl: projectUrl,
    modelFormat: uploadData.modelFormat as string,
    modelingFramework: simMethodData.framework as string,
    simulationAlgorithm: simMethodData.algorithm as string,
  };
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
): Observable<string> | null {
  const formData = CreateSubmissionFormData(dataSource);

  if (!formData) {
    console.log(`There is no form data. Returning null.`);
    return null;
  }
  const endpoints = new Endpoints();
  const url = endpoints.getCombineArchiveCreationEndpoint(true);
  return http.post<string>(url, formData, {}).pipe(
    catchError((error: HttpErrorResponse): Observable<string> => {
      console.error(error);
      errorHandler();
      return of<string>('');
    }),
  );
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
    console.log(`----- NULL`);
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
  );

  console.log(`--- A RERUN MODEL ID: ${dataSource?.reRunModelId}`);

  if (!archive) {
    console.log(`there is no archive`);
    return null;
  }

  const formData = new FormData();
  formData.append('specs', JSON.stringify(archive));
  console.log(`THE ARCHIVE SED SPEC: ${JSON.stringify(archive.contents[1])}`);

  const modelFile = uploadModelData.modelFile as File;
  if (modelFile) {
    formData.append('files', modelFile);
    console.log(`appending model file!: ${modelFile.name}`);
  } else {
    console.log(`NO MODEL FILE`);
  }

  formData.getAll('specs').forEach((entry: FormDataEntryValue) => {
    console.log(`THE ENTRY FOR SPECS: ${entry}`);
  });

  return formData;
}
