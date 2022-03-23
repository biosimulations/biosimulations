import { Component, OnDestroy } from '@angular/core';
import { FormStepData } from './form-step';
import { Subscription, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SimulationType } from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SedDocument } from '@biosimulations/combine-api-angular-client';
import { environment } from '@biosimulations/shared/environments';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import {
  ArchiveCreationUtility,
  ArchiveCreationSedDocumentData,
} from '@biosimulations/simulation-project-utils/service';

export type IntrospectionCallback = (introspectionData: ArchiveCreationSedDocumentData | undefined) => void;

@Component({
  selector: 'create-project-introspecting-model',
  templateUrl: './introspecting-model.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class IntrospectingModelComponent implements OnDestroy {
  private endpoints = new Endpoints();
  private modelIntrospectionSubscription: Subscription | undefined = undefined;

  public constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  public ngOnDestroy(): void {
    if (this.modelIntrospectionSubscription) {
      this.modelIntrospectionSubscription.unsubscribe();
      this.modelIntrospectionSubscription = undefined;
    }
  }

  public introspectModel(modelData: FormStepData, simMethodData: FormStepData, callback: IntrospectionCallback): void {
    if (this.modelIntrospectionSubscription) {
      this.modelIntrospectionSubscription.unsubscribe();
      this.modelIntrospectionSubscription = undefined;
    }

    const formData = this.createFormData(modelData, simMethodData);
    if (!formData) {
      setTimeout(() => {
        callback(undefined);
      });
      return;
    }

    const modelUrl = modelData?.modelUrl as string;
    const simulationType = simMethodData?.simulationType as SimulationType;

    const introspectionEndpoint = this.endpoints.getModelIntrospectionEndpoint(false);
    const sedDoc = this.postSedDocument(introspectionEndpoint, formData, modelUrl);

    this.modelIntrospectionSubscription = sedDoc.subscribe((sedDoc: SedDocument | null): void => {
      this.modelIntrospectionSubscription?.unsubscribe();
      this.modelIntrospectionSubscription = undefined;
      if (!sedDoc) {
        callback(undefined);
        return;
      }
      callback(ArchiveCreationUtility.createArchiveCreationSedDocumentData(sedDoc, simulationType));
    });
  }

  private createFormData(modelData: FormStepData, simMethodData: FormStepData): FormData | undefined {
    const modelFormat = modelData?.modelFormat as string;
    const modelFile = modelData?.modelFile as Blob;
    const modelUrl = modelData?.modelUrl as string;
    const frameworkId = simMethodData?.framework as string;
    const simulationType = simMethodData?.simulationType as SimulationType;
    const algorithmId = simMethodData?.algorithm as string;
    if (!modelFormat || (!modelUrl && !modelFile) || !frameworkId || !simulationType || !algorithmId) {
      return undefined;
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

  private postSedDocument(postEndpoint: string, formData: FormData, modelUrl: string): Observable<SedDocument | null> {
    return this.http.post<SedDocument>(postEndpoint, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<null> => {
        if (!environment.production) {
          console.error(error);
        }
        this.showIntrospectionFailedSnackbar(modelUrl);
        return of<null>(null);
      }),
    );
  }

  private showIntrospectionFailedSnackbar(modelUrl: string): void {
    let msg =
      'Sorry! We were unable to get the input parameters and output variables of your model. ' +
      'This feature is only currently available for models encoded in BNGL, CellML, SBML, SBML-fbc, ' +
      'SBML-qual, and Smoldyn. Please refresh to try again.';
    if (modelUrl) {
      msg += ` Please check that ${modelUrl} is an accessible URL.`;
    }
    this.snackBar.open(msg, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
