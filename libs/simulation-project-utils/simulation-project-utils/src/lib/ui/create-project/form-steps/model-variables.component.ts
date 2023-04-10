import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import { UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR, SEDML_ID_VALIDATOR } from '@biosimulations/shared/ui';
import { SedVariable } from '@biosimulations/combine-api-angular-client';

enum ModelVariableType {
  symbol = 'symbol',
  target = 'target',
}

@Component({
  selector: 'create-project-model-variables',
  templateUrl: './model-variables.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class ModelVariablesComponent implements IFormStepComponent {
  public nextClicked = false;
  public formArray: UntypedFormArray;
  public modelVariableTypes: Record<string, string>[] = [
    {
      id: ModelVariableType.symbol,
      name: 'Symbol',
    },
    {
      id: ModelVariableType.target,
      name: 'Target',
    },
  ];

  public constructor(private formBuilder: UntypedFormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
    const defaultRowCount = 5;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelVariableField();
    }
  }

  /**
   * Preloads any variables parsed out of the uploaded SedDocument into the form.
   * @param introspectedVariables SedVariable instances parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedVariables(introspectedVariables: SedVariable[]): void {
    if (introspectedVariables.length === 0) {
      return;
    }
    introspectedVariables.sort((a, b): number => {
      const aType = a.symbol ? ModelVariableType.symbol : ModelVariableType.target;
      const bType = b.symbol ? ModelVariableType.symbol : ModelVariableType.target;
      if (aType === bType) {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      } else {
        return aType.localeCompare(bType, undefined, { numeric: true });
      }
    });
    this.formArray.clear();
    introspectedVariables.forEach((variable: SedVariable): void => {
      const type = variable.symbol ? ModelVariableType.symbol : ModelVariableType.target;
      const symbolOrTarget = variable.symbol || variable.target?.value;
      const formData: Record<string, string | null> = {
        type: type,
        id: variable.id,
        name: variable.name || null,
        symbolOrTarget: symbolOrTarget || null,
      };
      this.addModelVariableField(formData);
    });
  }

  /**
   * Loads any previously entered data back into the form. This will be called immediately before the
   * form step appears and will overwrite any model changes loaded via introspection.
   * @param formStepData Data containing the previously entered variables.
   */
  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelVariables = formStepData.modelVariables as Record<string, string>[];
    if (!modelVariables || modelVariables.length === 0) {
      return;
    }
    this.formArray.clear();
    modelVariables.forEach((modelVariable: Record<string, string>): void => {
      this.addModelVariableField(modelVariable);
    });
  }

  public getFormStepData(): FormStepData | null {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return null;
    }
    const modelVariables: Record<string, string>[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as UntypedFormGroup;
      modelVariables.push({
        id: formGroup.value.id,
        name: formGroup.value.name,
        type: formGroup.value.type,
        symbolOrTarget: formGroup.value.symbolOrTarget,
      });
    });
    return {
      modelVariables: modelVariables,
    };
  }

  public formGroups(): UntypedFormGroup[] {
    return this.formArray.controls as UntypedFormGroup[];
  }

  public addModelVariableField(modelVariable?: Record<string, string | null>): void {
    this.formArray.push(
      this.formBuilder.group({
        id: [modelVariable?.id, [Validators.required, SEDML_ID_VALIDATOR]],
        name: [modelVariable?.name],
        type: [modelVariable?.type, [Validators.required]],
        symbolOrTarget: [modelVariable?.symbolOrTarget, Validators.required],
      }),
    );
  }

  public removeModelVariableField(index: number): void {
    this.formArray.removeAt(index);
  }

  public shouldShowIdError(formGroup: UntypedFormGroup): boolean {
    const invalidId = formGroup.hasError('validSedmlId', 'id');
    const missingId = formGroup.hasError('required', 'id');
    return this.nextClicked && (invalidId || missingId);
  }
}
