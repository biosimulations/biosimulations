import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { environment } from '@biosimulations/shared/environments';
import { SimulationStatus } from '../../../datamodel';
import { map } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
  formGroup: FormGroup;
  simulators: Array<string> = [];
  simulatorVersions: Array<string> = [];

  simulatorsError: string | undefined = undefined;
  simulatorVersionsError: string | undefined = undefined;
  submitError: string | undefined = undefined;

  simulatorVersionsMap: any | undefined = undefined;

  simulationId: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
  ) {
    this.formGroup = formBuilder.group({
      projectFile: ['', [Validators.required]],
      simulator: ['', [Validators.required]],
      simulatorVersion: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params): void => {
      const simulator: string = params?.simulator;
      const simulatorVersion: string = params?.simulatorVersion;
      if (simulator) {
        this.formGroup.controls.simulator.setValue(
          simulator
        );
        this.onSimulatorChange({ value: simulator });
        if (simulatorVersion) {
          this.formGroup.controls.simulatorVersion.setValue(
            simulatorVersion
          );
        }
      }
    });


    this.dispatchService.getSimulatorsFromDb().subscribe((simDict: any) => {
      this.simulators = Object.keys(simDict);
      this.simulatorVersionsMap = simDict;
    },
      (error: HttpErrorResponse) => {
        this.simulatorsError =
          'Sorry! We were not able to retrieve the available simulators.';
        this.formGroup.controls.simulator.disable();
        if (!environment.production) {
          console.error(
            'Error ' +
            error.status.toString() +
            ' while fetching simulators: ' +
            error.message
          );
        }
      }
    );
  }

  onFormSubmit() {
    this.submitError = undefined;
    this.simulationId = undefined;

    if (!this.formGroup.valid) {
      return;
    }

    const projectFile: File = this.formGroup.value.projectFile;
    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const name: string = this.formGroup.value.name;
    const email: string = this.formGroup.value.email;

    this.dispatchService
      .submitJob(projectFile, simulator, simulatorVersion, name, email)
      .subscribe(
        (data: any) => {
          if (!environment.production) {
            console.log('Response from server: ', data);
          }
          const simulationId = data['data']['id'];
          this.dispatchService.uuidsDispatched.push(simulationId);
          this.dispatchService.uuidUpdateEvent.next(simulationId);
          this.simulationId = simulationId;

          this.simulationService.storeSimulation({
            id: simulationId,
            name: name,
            email: email,
            submittedLocally: true,
            status: SimulationStatus.queued,
            runtime: null,
            submitted: new Date(),
            updated: new Date(),
            resultSize: null,
            projectSize: null,
          });
        },
        (error: HttpErrorResponse) => {
          this.submitError = error.message;
          if (!environment.production) {
            console.error(
              'Error ' +
              error.status.toString() +
              ' while submitting simulation: ' +
              error.message
            );
          }
        }
      );
  }

  onSimulatorChange($event: any) {

    if (this.simulatorVersionsMap !== undefined) {
      this.simulatorVersions = Array.from(this.simulatorVersionsMap[$event.value]);
      this.simulatorVersionsError = undefined;
      this.formGroup.controls.simulatorVersion.enable();
      this.formGroup.controls.simulatorVersion.setValue(
        this.simulatorVersions[0]
      );
    }
  }
}
