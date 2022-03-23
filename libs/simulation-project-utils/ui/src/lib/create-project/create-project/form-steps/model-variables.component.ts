import { Component } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormStepComponent, FormStepData } from './form-step';
import { UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR, SEDML_ID_VALIDATOR } from '@biosimulations/shared/ui';
import {
  SedVariable,
  SedVariableTypeEnum,
  Namespace,
  SedTarget,
  SedTargetTypeEnum,
} from '@biosimulations/combine-api-angular-client';

enum ModelVariableType {
  symbol = 'symbol',
  target = 'target',
}

interface ModelVariableTypeData {
  id: ModelVariableType;
  name: string;
}

@Component({
  selector: 'create-project-model-variables',
  templateUrl: './model-variables.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class ModelVariablesComponent implements FormStepComponent {
  public nextClicked = false;

  public formArray: FormArray;
  public modelVariableTypes: ModelVariableTypeData[] = [
    {
      id: ModelVariableType.symbol,
      name: 'Symbol',
    },
    {
      id: ModelVariableType.target,
      name: 'Target',
    },
  ];

  private namespaces: Namespace[] = [];

  public constructor(private formBuilder: FormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
    const defaultRowCount = 5;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelVariable();
    }
  }

  public setup(namespaces: Namespace[]): void {
    this.namespaces = namespaces;
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelVariables = formStepData?.modelVariables as SedVariable[];
    if (!modelVariables || modelVariables.length === 0) {
      return;
    }
    this.formArray.clear();
    modelVariables.sort((a, b): number => {
      const aType = a.symbol ? ModelVariableType.symbol : ModelVariableType.target;
      const bType = b.symbol ? ModelVariableType.symbol : ModelVariableType.target;
      if (aType === bType) {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      } else {
        return aType.localeCompare(bType, undefined, { numeric: true });
      }
    });
    modelVariables.forEach((modelVariable: SedVariable): void => {
      this.addModelVariable(modelVariable);
    });
  }

  public getFormStepData(): FormStepData {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return undefined;
    }
    const modelVariables: SedVariable[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as FormGroup;
      const symbolType = formGroup.value.type === ModelVariableType.symbol;
      let target: SedTarget | undefined = undefined;
      if (!symbolType) {
        target = {
          _type: SedTargetTypeEnum.SedTarget,
          value: formGroup.value.symbolOrTarget,
          namespaces: this.namespaces,
        };
      }
      modelVariables.push({
        _type: SedVariableTypeEnum.SedVariable,
        id: formGroup.value.id,
        name: formGroup.value.name,
        symbol: symbolType ? formGroup.value.symbolOrTarget : undefined,
        target: target,
        model: undefined,
        task: '',
      });
    });
    return {
      modelVariables: modelVariables,
    };
  }

  public formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  public addModelVariable(modelVariable?: SedVariable): void {
    const type = modelVariable?.symbol ? ModelVariableType.symbol : ModelVariableType.target;
    this.formArray.push(
      this.formBuilder.group({
        id: [modelVariable?.id, [Validators.required, SEDML_ID_VALIDATOR]],
        name: [modelVariable?.name],
        type: [type, [Validators.required]],
        symbolOrTarget: [modelVariable?.symbol || modelVariable?.target?.value, Validators.required],
      }),
    );
  }

  public removeModelVariable(iVariable: number): void {
    this.formArray.removeAt(iVariable);
  }

  public shouldShowIdError(formGroup: FormGroup): boolean {
    const invalidId = formGroup.hasError('validSedmlId', 'id');
    const missingId = formGroup.hasError('required', 'id');
    return this.nextClicked && (invalidId || missingId);
  }
}
