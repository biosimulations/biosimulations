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
  OmexMetadataInputFormat,
  OmexMetadataSchema,
} from '@biosimulations/datamodel/common';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ConfigService } from '@biosimulations/shared/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import isUrl from 'is-url';

enum SubmitMethod {
  file = 'file',
  url = 'url',
}

@Component({
  selector: 'biosimulations-validate-project',
  templateUrl: './validate-project.component.html',
  styleUrls: ['./validate-project.component.scss'],
})
export class ValidateProjectComponent implements OnInit, OnDestroy {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  projectFileControl: FormControl;
  projectUrlControl: FormControl;

  omexMetadataFormats = Object.keys(OmexMetadataInputFormat).sort();
  omexMetadataSchemas = [
    {
      label: 'BioSimulations',
      value: 'BioSimulations',
    },
    {
      label: 'None (OMEX Metadata)',
      value: 'rdf_triples',
    },
  ];

  exampleCombineArchiveUrl: string;
  exampleCombineArchivesUrl: string;

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
        projectFile: ['', [Validators.required, this.maxFileSizeValidator]],
        projectUrl: ['', [this.urlValidator]],
        omexMetadataFormat: [OmexMetadataInputFormat.rdfxml],
        omexMetadataSchema: [OmexMetadataSchema.BioSimulations],
        validateOmexManifest: [true],
        validateSedml: [true],
        validateSedmlModels: [true],
        validateOmexMetadata: [true],
        validateImages: [true],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    this.projectFileControl = this.formGroup.controls
      .projectFile as FormControl;
    this.projectUrlControl = this.formGroup.controls.projectUrl as FormControl;

    this.projectUrlControl.disable();

    this.exampleCombineArchivesUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleCombineArchiveUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.exampleProjectPath;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      const archiveUrl = params?.archiveUrl;
      if (archiveUrl) {
        const submitMethodControl = this.formGroup.controls
          .submitMethod as FormControl;
        const projectUrlControl = this.formGroup.controls
          .projectUrl as FormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        projectUrlControl.setValue(archiveUrl);
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
      if (!formGroup.value.projectFile) {
        errors['noProjectFile'] = true;
      }
    } else {
      if (!formGroup.value.projectUrl) {
        errors['noProjectUrl'] = true;
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
      this.formGroup.controls.projectFile.enable();
      this.formGroup.controls.projectUrl.disable();
    } else {
      this.formGroup.controls.projectFile.disable();
      this.formGroup.controls.projectUrl.enable();
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

    let archive: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      archive = this.formGroup.controls.projectFile.value;
    } else {
      archive = this.formGroup.controls.projectUrl.value;
    }

    // call API to validate archive
    const validationSub = this.combineService
      .validateProject(
        archive,
        this.formGroup.controls.omexMetadataFormat.value,
        this.formGroup.controls.omexMetadataSchema.value,
        this.formGroup.controls.validateOmexManifest.value,
        this.formGroup.controls.validateSedml.value,
        this.formGroup.controls.validateSedmlModels.value,
        this.formGroup.controls.validateOmexMetadata.value,
        this.formGroup.controls.validateImages.value,
      )
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
          let msg = 'Sorry! We were unable to validate your archive.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${archive} is an accessible URL.`;
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

  private formSectionOpen = {
    metadataOptions: new BehaviorSubject<boolean>(true),
    validationOptions: new BehaviorSubject<boolean>(true),
  };
  formSectionOpen$ = {
    metadataOptions: this.formSectionOpen.metadataOptions.asObservable(),
    validationOptions: this.formSectionOpen.validationOptions.asObservable(),
  };
  toggleFormSection(name: 'metadataOptions' | 'validationOptions'): void {
    this.formSectionOpen[name].next(!this.formSectionOpen[name].value);
  }
}
