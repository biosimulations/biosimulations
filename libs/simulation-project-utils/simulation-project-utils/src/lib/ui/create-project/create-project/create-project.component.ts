import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimulationProjectUtilLoaderService } from '../../../service/simulation-project-util-loader/simulation-project-util-loader.service';
import { SimulationProjectUtilData } from '../../../service/simulation-project-util-loader/simulation-project-util-loader.service';
import { IntrospectNewProject } from '../../../service/create-project/project-introspection';
import { CustomizableSedDocumentData } from '../../../service/create-project/project-introspection';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '@biosimulations/config/angular';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';
import { CreateSimulationParams, SubmitFormData } from './project-submission';
import { CreateProjectDataSource, CreateProjectFormStep } from './create-project-data-source';
import { environment } from '@biosimulations/shared/environments';

@Component({
  selector: 'biosimulations-create-project',
  templateUrl: './create-project.component.html',
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  public shouldShowSpinner = true;
  public formDataSource?: CreateProjectDataSource;
  public isReRun!: boolean;

  private subscriptions: Subscription[] = [];

  public constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private config: ConfigService,
    private loader: SimulationProjectUtilLoaderService,
    private activatedRoute: ActivatedRoute,
  ) {}

  // Life cycle

  public ngOnInit(): void {
    // get query params if any:
    this.isReRun = this.formDataSource ? this.formDataSource?.isReRun : false;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.populateChangesForm(params);
    });
    const loadObs = this.loader.loadSimulationUtilData();
    const loadSub = loadObs.subscribe(this.loadComplete.bind(this));
    this.subscriptions.push(loadSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  // Setup

  private populateChangesForm(params: Params): void {
    if (this.formDataSource) {
      this.formDataSource.preloadDataFromParams(params);
    }
  }

  private loadComplete(data: SimulationProjectUtilData): void {
    this.formDataSource = new CreateProjectDataSource(
      data.simulators,
      data.algorithmSubstitutions,
      this.introspectionProvider.bind(this),
      this.onDownloadClicked.bind(this),
      this.onSimulateClicked.bind(this),
    );
    this.formDataSource.preloadDataFromParams(data.params);
    this.shouldShowSpinner = false;
  }

  // Control callbacks

  private onSimulateClicked(): void {
    console.log(`Simulate clicked!`);
    this.submitFormData((projectUrl: string): void => {
      this.simulateCreatedCombineArchive(projectUrl);
    });
  }

  private onDownloadClicked(): void {
    this.submitFormData((projectUrl: string): void => {
      this.downloadCreatedCombineArchive(projectUrl);
    });
  }

  private introspectionProvider(dataSource: CreateProjectDataSource): Observable<void> | null {
    const errorHandler = this.showIntrospectionFailedSnackbar.bind(this);
    const formatData = dataSource.formData[CreateProjectFormStep.UploadModel];
    const simMethodData = dataSource.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const introspectionObservable = IntrospectNewProject(this.http, formatData, simMethodData, errorHandler);
    console.log(`INTROSPECTION PROVIDER EVOKED IN CREATE PROJECT: ${introspectionObservable}`);
    console.log(`THIS WAS THE DATA TO EVOKE IT: ${dataSource.formData}`);
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

  // Submission

  private simulateCreatedCombineArchive(projectUrl: string): void {
    const queryParams = this.formDataSource ? CreateSimulationParams(this.formDataSource, projectUrl) : null;
    if (!queryParams) {
      console.log(`no query params.`);
      return;
    }
    console.log(`The queryparams: ${queryParams}`);
    console.log(`app id: ${this.config.appId}`);
    if (this.config.appId === 'dispatch') {
      this.router.navigate(['/runs/new'], { queryParams });
    } else if (this.config.appId === 'platform') {
      this.router.navigate(['/runs/new'], { queryParams });
    } else {
      console.log(`new window`);
      const url = `https://run.biosimulations.${environment.production ? 'org' : 'dev'}/runs/new`;
      const queryParamsString = new URLSearchParams(queryParams).toString();
      window.open(`${url}?${queryParamsString}`, 'runbiosimulations');
    }
    this.showArchiveCreatedSnackbar();
  }

  private downloadCreatedCombineArchive(projectUrl: string): void {
    const a = document.createElement('a');
    a.href = projectUrl;
    a.download = 'archive.omex';
    a.click();
    this.showArchiveDownloadedSnackbar();
  }

  private submitFormData(completionHandler: (projectUrl: string) => void): void {
    console.log(`form being submitted...`);
    if (!this.formDataSource) {
      return;
    }
    const errorHandler = this.showProjectCreationErrorSnackbar.bind(this);
    const submissionObservable = SubmitFormData(this.formDataSource, this.http, errorHandler);
    if (!submissionObservable) {
      return;
    }
    const projectOrUrlSub = submissionObservable.subscribe(completionHandler);
    this.subscriptions.push(projectOrUrlSub);
    this.showPleaseWaitSnackbar();
  }

  // Snackbars

  private showArchiveDownloadedSnackbar(): void {
    this.showDefaultConfiguredSnackbar('Your archive was downloaded to your computer.');
  }

  private showArchiveCreatedSnackbar(): void {
    this.showDefaultConfiguredSnackbar('Your archive was created. Please use this form to execute it.');
  }

  private showProjectCreationErrorSnackbar(): void {
    const msg = 'Sorry! We were unable to generate your COMBINE/OMEX archive. Please refresh to try again.';
    this.showDefaultConfiguredSnackbar(msg);
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

  private showPleaseWaitSnackbar(): void {
    this.snackBar.openFromComponent(HtmlSnackBarComponent, {
      data: {
        message: 'Please wait while your project is created',
        spinner: true,
        action: 'Ok',
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private showDefaultConfiguredSnackbar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
