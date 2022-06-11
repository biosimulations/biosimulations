import { Component, OnInit, OnDestroy } from '@angular/core';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { CombineApiService } from '../../../services/combine-api/combine-api.service';
import {
  SimulationProjectUtilLoaderService,
  SimulationProjectUtilData,
} from '@biosimulations/simulation-project-utils/service';
import { Simulation } from '../../../datamodel';
import { Purpose, SimulationRunStatus, EnvironmentVariable, SimulationRun } from '@biosimulations/datamodel/common';
import { Observable, Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DispatchDataSource, DispatchFormStep } from './dispatch-data-source';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit, OnDestroy {
  public formDataSource?: DispatchDataSource;

  // Lifecycle state
  private subscriptions: Subscription[] = [];

  public constructor(
    private config: ConfigService,
    private router: Router,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
    private combineApiService: CombineApiService,
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
    this.formDataSource = new DispatchDataSource(
      data,
      this.config,
      this.combineApiService,
      this.onFormSubmit.bind(this),
    );
  }

  // Form Submission

  public onFormSubmit(): void {
    if (!this.formDataSource) {
      return;
    }

    // Unpack form data
    const formData = this.formDataSource.formData;
    const uploadProjectData = formData[DispatchFormStep.UploadProject];
    const projectUrl = uploadProjectData.projectUrl as string;
    const projectFile = uploadProjectData.projectFile as File;
    const simulationToolData = formData[DispatchFormStep.SimulationTool];
    const simulator = simulationToolData.simulator as string;
    const simulatorVersion = simulationToolData.simulatorVersion as string;
    const commercialSolversData = formData[DispatchFormStep.CommercialSolvers];
    const purpose = commercialSolversData.academicPurpose ? Purpose.academic : Purpose.other;
    const computationalResourcesData = formData[DispatchFormStep.ComputationalResources];
    const cpus = computationalResourcesData.cpus as number;
    const memory = computationalResourcesData.memory as number;
    const maxTime = computationalResourcesData.maxTime as number;
    const metadataData = formData[DispatchFormStep.Metadata];
    const name = metadataData.name as string;
    const notificationsData = formData[DispatchFormStep.Notifications];
    const email = (notificationsData.email as string) || null;
    const envVars: EnvironmentVariable[] = [];

    // Submit job to run Simulation
    let simulationResponse: Observable<SimulationRun>;
    if (projectUrl) {
      simulationResponse = this.dispatchService.sumbitJobForURL(
        projectUrl,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
        envVars,
        purpose,
        name,
        email,
      );
    } else {
      simulationResponse = this.dispatchService.submitJobForFile(
        projectFile,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
        envVars,
        purpose,
        name,
        email,
      );
    }

    // Process the response
    const sub = simulationResponse.subscribe((data: SimulationRun) =>
      this.processSimulationResponse(
        data,
        name,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
        envVars,
        purpose,
        email,
      ),
    );
    this.subscriptions.push(sub);
  }

  // Network callbacks

  private processSimulationResponse(
    data: SimulationRun,
    name: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // min min
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    email: string | null,
  ): void {
    const simulationId = data.id;
    const simulatorDigest = data.simulatorDigest;
    const submitted = new Date(data.submitted);
    const updated = new Date(data.submitted);
    const simulation: Simulation = {
      id: simulationId,
      name: name,
      email: email || undefined,
      simulator: simulator,
      simulatorVersion: simulatorVersion,
      simulatorDigest: simulatorDigest,
      cpus: cpus,
      memory: memory,
      maxTime: maxTime,
      envVars: envVars,
      purpose: purpose,
      submittedLocally: true,
      status: SimulationRunStatus.QUEUED,
      runtime: undefined,
      submitted: submitted,
      updated: updated,
    };
    this.simulationService.storeNewLocalSimulation(simulation);
    this.router.navigate(['/runs', simulationId]);
    this.showFormSubmittedSnackbar();
  }

  // Snackbars

  private showFormSubmittedSnackbar(): void {
    this.snackBar.open(
      `Your simulation was submitted. ` +
        'You can view the status of your simulation at this page ' +
        'or from the "Your simulation runs page". ' +
        'When your simulation completes, you will be able to ' +
        'retrieve and visualize its results here.',
      'Ok',
      {
        duration: 10000,
      },
    );
  }
}
