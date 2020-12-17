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
import { SimulationRunStatus } from '../../../datamodel';
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
    private simulationService: SimulationService
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
        this.formGroup.controls.simulator.setValue(simulator);
        this.onSimulatorChange({ value: simulator });
        if (simulatorVersion) {
          this.formGroup.controls.simulatorVersion.setValue(simulatorVersion);
        }
      }
    });

    this.dispatchService.getSimulatorsFromDb().subscribe((simDict: any) => {
      // this.simulators = Object.keys(simDict);
      // this.simulatorVersionsMap = simDict;
      // Note: Hardcoded available simulators, to make it dynamic uncomment above two lines and delete the hard-coded ones
      // TODO: Un-hardcode simulators
      this.simulatorVersionsMap = {
        bionetgen: ['2.5.1'],
        copasi: ['4.28.226', '4.29.227', '4.30.233'],
        gillespy2: ['1.5.4', '1.5.5', '1.5.6'],
        vcell: ['7.3.0.0', '7.3.0.06'],
        tellurium: ['2.1.6'],
      };
      this.simulators = Object.keys(this.simulatorVersionsMap);

      this.simulators.sort((a: string, b: string): number => {
        return a.localeCompare(b, undefined, { numeric: true });
      });

      this.simulators.forEach((simulator: string): void => {
        this.simulatorVersionsMap[simulator]
          .sort((a: string, b: string): number => {
            return a.localeCompare(b, undefined, { numeric: true });
          })
          .reverse();
      });
    });
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
      .subscribe((data: any) => {
        const simulationId = data['id'];
        this.dispatchService.uuidsDispatched.push(simulationId);
        this.dispatchService.uuidUpdateEvent.next(simulationId);
        this.simulationId = simulationId;

        this.simulationService.storeNewLocalSimulation({
          id: simulationId,
          name: name,
          email: email,
          simulator: simulator,
          simulatorVersion: simulatorVersion,
          submittedLocally: true,
          status: SimulationRunStatus.QUEUED,
          runtime: undefined,
          submitted: new Date(),
          updated: new Date(),
        });
      });
  }

  onSimulatorChange($event: any) {
    if (this.simulatorVersionsMap !== undefined) {
      this.simulatorVersions = Array.from(
        this.simulatorVersionsMap[$event.value]
      );
      this.simulatorVersionsError = undefined;
      this.formGroup.controls.simulatorVersion.enable();
      this.formGroup.controls.simulatorVersion.setValue(
        this.simulatorVersions[0]
      );
    }
  }
}
