import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, ValidationErrors } from '@angular/forms';
import { CombineApiService } from '@biosimulations/simulation-project-utils/service';
import { ValidationReport, ValidationMessage, ValidationStatus } from '@biosimulations/datamodel/common';
import { Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import isUrl from 'is-url';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';
import { FileInput } from '@biosimulations/material-file-input';

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
  formGroup: UntypedFormGroup;
  submitMethodControl: UntypedFormControl;
  simulationFileControl: UntypedFormControl;
  simulationUrlControl: UntypedFormControl;

  exampleSimulationUrl: string;
  exampleSimulationsUrl: string;

  submitPushed = false;

  private subscriptions: Subscription[] = [];

  status: ValidationStatus | undefined = undefined;
  errors: string | undefined = undefined;
  warnings: string | undefined = undefined;

  constructor(
    private config: ConfigService,
    private formBuilder: UntypedFormBuilder,
    private combineApiService: CombineApiService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        simulationFile: ['', [Validators.required, this.maxFileSizeValidator.bind(this)]],
        simulationUrl: ['', [this.urlValidator]],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls.submitMethod as UntypedFormControl;
    this.simulationFileControl = this.formGroup.controls.simulationFile as UntypedFormControl;
    this.simulationUrlControl = this.formGroup.controls.simulationUrl as UntypedFormControl;

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
        const submitMethodControl = this.formGroup.controls.submitMethod as UntypedFormControl;
        const simulationUrlControl = this.formGroup.controls.simulationUrl as UntypedFormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        simulationUrlControl.setValue(simulationUrl);
        this.changeSubmitMethod();
      }
    });
  }

  maxFileSizeValidator(control: UntypedFormControl): ValidationErrors | null {
    const fileInput: FileInput | null = control.value;
    const file: File | undefined = fileInput?.files ? fileInput.files[0] : undefined;
    const fileSize = file?.size;

    if (fileSize && fileSize > this.config.appConfig.maxUploadFileSize) {
      return {
        maxSize: true,
      };
    } else {
      return null;
    }
  }

  urlValidator(control: UntypedFormControl): ValidationErrors | null {
    const value = control.value;
    if (value && isUrl(control.value)) {
      return null;
    } else {
      return {
        url: true,
      };
    }
  }

  formValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
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
    const submitMethodControl = this.formGroup.controls.submitMethod as UntypedFormControl;
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
    const submitMethodControl = this.formGroup.controls.submitMethod as UntypedFormControl;

    let simulation: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      const fileInput: FileInput = this.formGroup.controls.simulationFile.value;
      simulation = fileInput.files[0];
    } else {
      simulation = this.formGroup.controls.simulationUrl.value;
    }

    // call API to validate simulation
    const validationSub = this.combineApiService
      .validateSimulation(simulation)
      .subscribe((report: ValidationReport | undefined): void => {
        if (report) {
          this.status = report.status;

          if (report?.errors?.length) {
            this.errors = this.convertValidationMessagesToList(report?.errors as ValidationMessage[]);
          }
          if (report?.warnings?.length) {
            this.warnings = this.convertValidationMessagesToList(report?.warnings as ValidationMessage[]);
          }

          this.snackBar.open('The validation of your simulation completed.', 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          let msg = 'Sorry! We were unable to validate your simulation.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${simulation} is an accessible URL.`;
          }
          msg += ' Please refresh to try again.';

          this.snackBar.open(msg, 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
    this.subscriptions.push(validationSub);

    // display status
    this.snackBar.openFromComponent(HtmlSnackBarComponent, {
      data: {
        message: 'Please wait while your simulation is validated',
        spinner: true,
        action: 'Ok',
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private convertValidationMessagesToList(messages: ValidationMessage[]): string {
    return messages
      .map((message: ValidationMessage): string => {
        let details = '';
        if (message?.details?.length) {
          details = '<ul>' + this.convertValidationMessagesToList(message?.details as ValidationMessage[]) + '</ul>';
        }

        return '<li>' + message.summary + details + '</li>';
      })
      .join('\n');
  }
}
