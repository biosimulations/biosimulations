import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimulationProjectsService } from '@biosimulations/combine-api-angular-client';
import {
  SimulationProjectUtilLoaderService,
  SimulationProjectUtilData,
  CopyArchive,
  MultipleSimulatorsAlgorithmParameter,
} from '@biosimulations/simulation-project-utils/service';
import { FormStepData } from '@biosimulations/shared/ui';
import { environment } from '@biosimulations/shared/environments';
import { CombineArchiveSedDocSpecs } from '@biosimulations/datamodel/common';
import { Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ModifyRunDataSource, ModifyRunFormStep } from './modify-run-data-source';
import { CombineApiService } from '../../../services/combine-api/combine-api.service';
import isUrl from 'is-url';

@Component({
  selector: 'biosimulations-modify-run',
  templateUrl: './modify-run.component.html',
})
export class ModifyRunComponent implements OnInit, OnDestroy {
  public shouldShowSpinner = true;
  public dataSource?: ModifyRunDataSource;

  private subscriptions: Subscription[] = [];
  private projectUrl?: string;

  public constructor(
    private config: ConfigService,
    private router: Router,
    private combineApiService: CombineApiService,
    private projectsService: SimulationProjectsService,
    private snackBar: MatSnackBar,
    private loader: SimulationProjectUtilLoaderService,
  ) {}

  // Life cycle

  public ngOnInit(): void {
    const loadObs = this.loader.loadSimulationUtilData();
    const loadSub = loadObs.subscribe(this.loadComplete.bind(this));
    this.subscriptions.push(loadSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private loadComplete(data: SimulationProjectUtilData): void {
    const projectUrl = data.params.projectUrl;
    if (!projectUrl || !isUrl(projectUrl)) {
      this.showLoadErrorSnackbar();
      return;
    }
    this.projectUrl = projectUrl;
    const specsObservable = this.combineApiService.getSpecsOfSedDocsInCombineArchive(projectUrl);
    const subscription = specsObservable.subscribe((archive?: CombineArchiveSedDocSpecs) => {
      if (!archive) {
        this.showLoadErrorSnackbar();
        return;
      }
      this.dataSource = new ModifyRunDataSource(
        archive,
        this.onDownloadClicked.bind(this),
        this.onSimulateClicked.bind(this),
      );
      this.shouldShowSpinner = false;
    });
    this.subscriptions.push(subscription);
  }

  private onSimulateClicked(): void {
    this.createModifiedArchive(false);
  }

  private onDownloadClicked(): void {
    this.createModifiedArchive(true);
  }

  private createModifiedArchive(download: boolean): void {
    const originalArchiveSpecs = this.dataSource?.archive;
    const originalArchiveContents = originalArchiveSpecs?.contents[0];
    const originalSedmlDoc = originalArchiveContents?.location.value;

    if (!this.projectUrl || !this.dataSource || !originalArchiveContents || !originalSedmlDoc) {
      this.showProjectCreationErrorSnackbar();
      return;
    }

    const archiveLocation = { url: this.projectUrl };

    const modelChangesData: FormStepData = this.dataSource.formData[ModifyRunFormStep.ModelChanges];
    const timeCourseData: FormStepData =
      this.dataSource.formData[ModifyRunFormStep.UniformTimeCourseSimulationParameters];
    const algorithmParamData: FormStepData = this.dataSource.formData[ModifyRunFormStep.AlgorithmParameters];

    const archiveSpecsToModify = CopyArchive(
      originalArchiveSpecs,
      this.dataSource.namespaces,
      timeCourseData?.initialTime as number,
      timeCourseData?.outputStartTime as number,
      timeCourseData?.outputEndTime as number,
      timeCourseData?.numberOfSteps as number,
      modelChangesData?.modelChanges as Record<string, string>[],
      algorithmParamData?.algorithmParameters as Record<string, MultipleSimulatorsAlgorithmParameter>,
    );

    // const modifyObservable = this.projectsService.srcHandlersCombineModifyHandler(
    //   archiveSpecsToModify,
    //   archiveLocation,
    // );
    // const modifySub = modifyObservable.subscribe((url: string): void => {
    //   if (download) {
    //     this.downloadCreatedCombineArchive(url);
    //   } else {
    //     this.simulateCreatedCombineArchive(url);
    //   }
    // });
    // this.subscriptions.push(modifySub);
  }

  private downloadCreatedCombineArchive(projectUrl: string): void {
    const a = document.createElement('a');
    a.href = projectUrl;
    a.download = 'archive.omex';
    a.click();
  }

  private simulateCreatedCombineArchive(projectUrl: string): void {
    const queryParams = { projectUrl: projectUrl };
    if (this.config.appId === 'dispatch') {
      this.router.navigate(['/runs/new'], { queryParams });
    } else {
      const url = `https://run.biosimulations.${environment.production ? 'org' : 'dev'}/runs/new`;
      const queryParamsString = new URLSearchParams(queryParams).toString();
      window.open(`${url}?${queryParamsString}`, 'runbiosimulations');
    }
  }

  // Snackbars

  private showLoadErrorSnackbar(): void {
    this.showDefaultConfiguredSnackbar('Sorry! Something went wrong, please refresh to try again..');
  }

  private showProjectCreationErrorSnackbar(): void {
    const msg = 'Sorry! We were unable to generate your COMBINE/OMEX archive. Please refresh to try again.';
    this.showDefaultConfiguredSnackbar(msg);
  }

  private showDefaultConfiguredSnackbar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
