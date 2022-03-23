import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormStepComponent, FormStepData } from './form-step';
import {
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
  NAMESPACE_PREFIX_VALIDATOR,
  URL_VALIDATOR,
} from '@biosimulations/shared/ui';
import { Namespace, NamespaceTypeEnum } from '@biosimulations/combine-api-angular-client';

@Component({
  selector: 'create-project-model-namespaces',
  templateUrl: './model-namespaces.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class ModelNamespacesComponent implements FormStepComponent {
  public nextClicked = false;

  public formArray: FormArray;

  public constructor(private formBuilder: FormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('prefix')],
    });
    this.addModelNamespace();
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const namespaces = formStepData?.namespaces as Namespace[];
    if (!formStepData || !namespaces || namespaces.length === 0) {
      return;
    }
    this.formArray.clear();
    namespaces.forEach((namespace: Namespace): void => {
      this.addModelNamespace(namespace);
    });
  }

  public getFormStepData(): FormStepData {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return undefined;
    }
    const namespaces: Namespace[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as FormGroup;
      const prefix: string = formGroup.controls.prefix.value;
      const uri: string = formGroup.controls.uri.value;
      namespaces.push({
        _type: NamespaceTypeEnum.Namespace,
        prefix: prefix,
        uri: uri,
      });
    });
    return {
      namespaces: namespaces,
    };
  }

  public addModelNamespace(namespace?: Namespace): void {
    this.formArray.push(
      this.formBuilder.group(
        {
          prefix: [namespace?.prefix, [NAMESPACE_PREFIX_VALIDATOR]],
          uri: [namespace?.uri, [URL_VALIDATOR]],
        },
        {
          validators: [this.hasUriOrNeither],
        },
      ),
    );
  }

  public removeModelNamespace(iNamespace: number): void {
    this.formArray.removeAt(iNamespace);
  }

  public formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  public showPrefixError(formGroup: FormGroup): boolean {
    const invalidPrefix = formGroup.hasError('validNamespacePrefix', 'prefix');
    return this.nextClicked && invalidPrefix;
  }

  public showUriError(formGroup: FormGroup): boolean {
    const invalidUri = formGroup.hasError('url', 'uri');
    const incompleteUri = formGroup.hasError('complete');
    return this.nextClicked && (invalidUri || incompleteUri);
  }

  private hasUriOrNeither(formGroup: FormGroup): ValidationErrors | null {
    const prefix = formGroup.controls.prefix.value;
    const uri = formGroup.controls.uri.value;
    if ((!prefix && !uri) || uri) {
      return null;
    }
    return { complete: true };
  }
}
