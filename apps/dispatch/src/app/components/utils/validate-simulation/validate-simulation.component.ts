import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { CombineService } from '../../../services/combine/combine.service';
import {
  ValidationReport,
  ValidationMessage,
  ValidationStatus,
} from '../../../datamodel/validation-report.interface';
import { Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/shared/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import isUrl from 'is-url';

enum SubmitMethod {
  file = 'file',
  url = 'url',
}

@Component({
  selector: 'biosimulations-validate-simulation',
  templateUrl: './validate-simulation.component.html',
  styleUrls: ['./validate-simulation.component.scss'],
})
export class ValidateSimulationComponent implements OnInit, OnDestroy {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  simulationFileControl: FormControl;
  simulationUrlControl: FormControl;

  exampleSimulationUrl: string;
  exampleSimulationsUrl: string;

  submitPushed = false;

  private subscriptions: Subscription[] = [];

  status: ValidationStatus | undefined = undefined;
  errors: string | undefined = undefined;
  warnings: string | undefined = undefined;

  constructor(
    private config: ConfigService,
    private formBuilder: FormBuilder,
    private combineService: CombineService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        simulationFile: ['', [Validators.required, this.maxFileSizeValidator]],
        simulationUrl: ['', [this.urlValidator]],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    this.simulationFileControl = this.formGroup.controls
      .simulationFile as FormControl;
    this.simulationUrlControl = this.formGroup.controls
      .simulationUrl as FormControl;

    this.simulationUrlControl.disable();

    this.exampleSimulationsUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleSimulationUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.exampleSimulationPath;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      const simulationUrl = params?.simulationUrl;
      if (simulationUrl) {
        const submitMethodControl = this.formGroup.controls
          .submitMethod as FormControl;
        const simulationUrlControl = this.formGroup.controls
          .simulationUrl as FormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        simulationUrlControl.setValue(simulationUrl);
        this.changeSubmitMethod();
      }
    });
  }

  maxFileSizeValidator(control: FormControl): ValidationErrors | null {
    if (
      control.value &&
      control.value.size > this.config.appConfig.maxUploadFileSize
    ) {
      return {
        maxSize: true,
      };
    } else {
      return null;
    }
  }

  urlValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value && isUrl(control.value)) {
      return null;
    } else {
      return {
        url: true,
      };
    }
  }

  formValidator(formGroup: FormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (formGroup.value.submitMethod == SubmitMethod.file) {
      if (!formGroup.value.simulationFile) {
        errors['noSimulationFile'] = true;
      }
    } else {
      if (!formGroup.value.simulationUrl) {
        errors['noSimulationUrl'] = true;
      }
    }

    if (Object.keys(errors).length) {
      return errors;
    } else {
      return null;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  changeSubmitMethod(): void {
    const submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    if (submitMethodControl.value === SubmitMethod.file) {
      this.formGroup.controls.simulationFile.enable();
      this.formGroup.controls.simulationUrl.disable();
    } else {
      this.formGroup.controls.simulationFile.disable();
      this.formGroup.controls.simulationUrl.enable();
    }
  }

  onFormSubmit(): void {
    this.submitPushed = true;

    if (!this.formGroup.valid) {
      return;
    }

    // clear previous report
    this.status = undefined;
    this.errors = undefined;
    this.warnings = undefined;

    // get data for API
    const submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;

    let simulation: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      simulation = this.formGroup.controls.simulationFile.value;
    } else {
      simulation = this.formGroup.controls.simulationUrl.value;
    }

    // call API to validate simulation
    const validationSub = this.combineService
      .validateSimulation(simulation)
      .subscribe((report: ValidationReport | undefined): void => {
        if (report) {
          this.status = report.status;

          if (report?.errors?.length) {
            this.errors = this.convertValidationMessagesToList(
              report?.errors as ValidationMessage[],
            );
          }
          if (report?.warnings?.length) {
            this.warnings = this.convertValidationMessagesToList(
              report?.warnings as ValidationMessage[],
            );
          }
        } else {
          let msg = 'Sorry! We were unable to validate your simulation.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${simulation} is an accessible URL.`;
          }

          this.snackBar.open(msg, undefined, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
    this.subscriptions.push(validationSub);
  }

  private convertValidationMessagesToList(
    messages: ValidationMessage[],
  ): string {
    return messages
      .map((message: ValidationMessage): string => {
        let details = '';
        if (message?.details?.length) {
          details =
            '<ul>' +
            this.convertValidationMessagesToList(
              message?.details as ValidationMessage[],
            ) +
            '</ul>';
        }

        return '<li>' + message.summary + details + '</li>';
      })
      .join('\n');
  }
}
