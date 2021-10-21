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
import {
  ModelLanguage,
  MODEL_FORMATS,
  ModelFormat,
} from '@biosimulations/datamodel/common';
import { Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/shared/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import isUrl from 'is-url';

enum SubmitMethod {
  file = 'file',
  url = 'url',
}

@Component({
  selector: 'biosimulations-validate-model',
  templateUrl: './validate-model.component.html',
  styleUrls: ['./validate-model.component.scss'],
})
export class ValidateModelComponent implements OnInit, OnDestroy {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  modelFileControl: FormControl;
  modelUrlControl: FormControl;

  modelLanguages = Object.keys(ModelLanguage).sort();

  modelFileFormats: string;

  exampleModelUrl: string;
  exampleModelsUrl: string;

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
    const modelFileFormats: string[] = [];
    MODEL_FORMATS.filter((modelFormat: ModelFormat): boolean => {
      return modelFormat.validationAvailable;
    }).forEach((modelFormat: ModelFormat): void => {
      modelFormat.extensions.forEach((extension: string): void => {
        modelFileFormats.push('.' + extension);
      });
      modelFormat.mediaTypes.forEach((mediaType: string): void => {
        modelFileFormats.push(mediaType);
      });
    });
    this.modelFileFormats = modelFileFormats.join(',');

    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        modelFile: ['', [Validators.required, this.maxFileSizeValidator]],
        modelUrl: ['', [this.urlValidator]],
        modelLanguage: [null],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    this.modelFileControl = this.formGroup.controls.modelFile as FormControl;
    this.modelUrlControl = this.formGroup.controls.modelUrl as FormControl;

    this.modelUrlControl.disable();

    this.exampleModelsUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleModelUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.exampleModelPath;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      const modelUrl = params?.modelUrl;
      if (modelUrl) {
        const submitMethodControl = this.formGroup.controls
          .submitMethod as FormControl;
        const modelUrlControl = this.formGroup.controls.modelUrl as FormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        modelUrlControl.setValue(modelUrl);
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
      if (!formGroup.value.modelFile) {
        errors['noModelFile'] = true;
      }
    } else {
      if (!formGroup.value.modelUrl) {
        errors['noModelUrl'] = true;
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
      this.formGroup.controls.modelFile.enable();
      this.formGroup.controls.modelUrl.disable();
    } else {
      this.formGroup.controls.modelFile.disable();
      this.formGroup.controls.modelUrl.enable();
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

    let model: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      model = this.formGroup.controls.modelFile.value;
    } else {
      model = this.formGroup.controls.modelUrl.value;
    }

    // call API to validate model
    const validationSub = this.combineService
      .validateModel(model, this.formGroup.controls.modelLanguage.value)
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
          let msg = 'Sorry! We were unable to validate your model.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${model} is an accessible URL.`;
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
