import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';
import {
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
  NAMESPACE_PREFIX_VALIDATOR,
  URL_VALIDATOR,
} from '@biosimulations/shared/ui';
import { Namespace, NamespaceTypeEnum } from '@biosimulations/combine-api-angular-client';

@Component({
  selector: 'create-project-namespaces',
  templateUrl: './namespaces.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class NamespacesComponent implements IFormStepComponent {
  public nextClicked = false;

  public formArray: FormArray;

  public constructor(private formBuilder: FormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('prefix')],
    });
    this.addNamespaceField();
  }

  /**
   * Preloads any namespaces parsed out of the uploaded SedDocument into the form.
   * @param introspectedNamespaces Namespaces parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedNamespaces(introspectedNamespaces: Namespace[]): void {
    if (!introspectedNamespaces || introspectedNamespaces.length === 0) {
      return;
    }
    this.loadNamespacesIntoForm(introspectedNamespaces);
  }

  /**
   * Loads any previously entered data back into the form. This will be called immediately before the
   * form step appears and will overwrite any namespaces loaded via introspection.
   * @param formStepData Data containing the previously entered namespaces.
   */
  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const namespaces = formStepData.namespaces as Namespace[];
    if (!namespaces || namespaces.length === 0) {
      return;
    }
    this.loadNamespacesIntoForm(namespaces);
  }

  public getFormStepData(): FormStepData | null {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return null;
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

  public addNamespaceField(preloadedNamespace?: Namespace): void {
    this.formArray.push(
      this.formBuilder.group(
        {
          prefix: [preloadedNamespace?.prefix, [NAMESPACE_PREFIX_VALIDATOR]],
          uri: [preloadedNamespace?.uri, [URL_VALIDATOR]],
        },
        {
          validators: [this.hasUriOrNeither],
        },
      ),
    );
  }

  public removeNamespaceField(index: number): void {
    this.formArray.removeAt(index);
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

  private loadNamespacesIntoForm(namespaces: Namespace[]): void {
    this.formArray.clear();
    namespaces.forEach((namespace: Namespace): void => {
      this.addNamespaceField(namespace);
    });
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
