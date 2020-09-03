import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { VisualisationService } from '../../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
  formGroup: FormGroup;
  projectFileError!: string;
  simulatorError!: string;
  simulatorVersionError!: string;
  nameError!: string;
  emailError!: string;
  simulators: Array<string> = [];
  simulatorVersions: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService
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
    this.dispatchService.getAllSimulatorInfo().subscribe(
      (simulators: any) => {
        this.simulators = simulators;
      },
      (error: any) => {
        console.log(
          'Error while fetching simulators and their versions: ',
          error
        );
      }
    );
  }

  onFormSubmit() {
    this.projectFileError = this.formGroup.controls.projectFile.errors
      ? this.formGroup.controls.projectFile.errors.required
      : null;
    this.simulatorError = this.formGroup.controls.simulator.errors
      ? this.formGroup.controls.simulator.errors.required
      : null;
    this.simulatorVersionError = this.formGroup.controls.simulatorVersion.errors
      ? this.formGroup.controls.simulatorVersion.errors.required
      : null;
    this.nameError = this.formGroup.controls.name.errors
      ? this.formGroup.controls.name.errors.name
      : null;
    this.emailError = this.formGroup.controls.email.errors
      ? this.formGroup.controls.email.errors.email
      : null;

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
          console.log('Response from server: ', data);
          // TODO: Return id-> uuid from dispatch API on successful simulation
          const uuid = data['data']['id'];
          this.dispatchService.uuidsDispatched.push(uuid);
          this.dispatchService.uuidUpdateEvent.next(uuid);
          alert('Job was submitted successfully!');
        },
        (error: object) => {
          console.log('Error occured while submitting simulation job: ', error);
        }
      );
  }

  onSimulatorChange($event: any) {
    this.dispatchService
      .getAllSimulatorInfo($event.value)
      .subscribe((simulatorVersions: any) => {
        this.simulatorVersions = simulatorVersions;
        this.formGroup.controls.simulatorVersion.setValue(
          this.simulatorVersions[0]
        );
      });
  }
}
