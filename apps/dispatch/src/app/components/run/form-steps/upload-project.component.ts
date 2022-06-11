import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ValidationErrors } from '@angular/forms';
import { IFormStepComponent, FormStepData, CreateMaxFileSizeValidator, URL_VALIDATOR } from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/config/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-upload-project',
  templateUrl: './upload-project.component.html',
})
export class UploadProjectComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public exampleCombineArchivesUrl?: string;
  public nextClicked = false;
  public updateCallback?: (stepComponent: IFormStepComponent) => void;

  private urlUpdateSubject: Subject<string> = new Subject();

  public constructor(formBuilder: UntypedFormBuilder, config: ConfigService) {
    this.formGroup = formBuilder.group(
      {
        projectFile: [null, [CreateMaxFileSizeValidator(config)]],
        projectUrl: [null, [URL_VALIDATOR]],
      },
      {
        validators: this.formValidator.bind(this),
      },
    );

    this.urlUpdateSubject.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((_value) => {
      this.triggerUpdateCallback();
    });
  }

  public setup(exampleUrl: string): void {
    this.exampleCombineArchivesUrl = exampleUrl;
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const projectUrl = formStepData.projectUrl;
    if (projectUrl) {
      this.formGroup.controls.projectUrl.setValue(projectUrl);
    }
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    const projectFile = this.formGroup.controls.projectFile?.value?.files[0];
    const projectUrl = this.formGroup.controls.projectUrl.value;
    return {
      projectUrl: projectUrl,
      projectFile: projectFile,
    };
  }

  public fileUpdated(): void {
    this.triggerUpdateCallback();
  }

  public urlUpdated(): void {
    this.urlUpdateSubject.next(this.formGroup.controls.projectUrl.value);
  }

  public shouldShowNoProjectError(): boolean {
    return this.formGroup.hasError('noProject') && this.nextClicked;
  }

  private triggerUpdateCallback(): void {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }

  private formValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};
    if (!formGroup.value.projectFile && !formGroup.value.projectUrl) {
      errors['noProject'] = true;
    }
    if (formGroup.value.projectFile && formGroup.value.projectUrl) {
      errors['multipleProjects'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }
}
