import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { FormStepComponent, FormStepData } from './form-step';
import { UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR, SEDML_ID_VALIDATOR } from '@biosimulations/shared/ui';
import {
  SedModelAttributeChange,
  SedModelAttributeChangeTypeEnum,
  SedTargetTypeEnum,
  SedModelChange,
  Namespace,
} from '@biosimulations/combine-api-angular-client';

@Component({
  selector: 'create-project-model-changes',
  templateUrl: './model-changes.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class ModelChangesComponent implements FormStepComponent {
  public nextClicked = false;
  public formArray: FormArray;

  private namespaces: Namespace[] = [];

  public constructor(private formBuilder: FormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
    const defaultRowCount = 3;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelChange();
    }
  }

  public setup(namespaces: Namespace[]): void {
    this.namespaces = namespaces;
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelChanges = formStepData?.modelChanges as SedModelChange[];
    if (!modelChanges || modelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    modelChanges.forEach((modelChange: SedModelChange): void => {
      this.addModelChange(modelChange);
    });
  }

  public getFormStepData(): FormStepData {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return undefined;
    }
    const modelChanges: SedModelChange[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as FormGroup;
      if (!formGroup.value.newValue) {
        return;
      }
      modelChanges.push({
        _type: SedModelAttributeChangeTypeEnum.SedModelAttributeChange,
        id: formGroup.value.id as string,
        name: formGroup.value.name as string,
        newValue: formGroup.value.newValue as string,
        target: {
          _type: SedTargetTypeEnum.SedTarget,
          namespaces: this.namespaces,
          value: formGroup.value.target as string,
        },
      });
    });
    return {
      modelChanges: modelChanges,
    };
  }

  public addModelChange(modelChange?: SedModelChange): void {
    // TODO: Support additional change types.
    if (modelChange && modelChange._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      return;
    }
    const modelAttributeChange = modelChange as SedModelAttributeChange;
    const modelChangeForm = this.formBuilder.group({
      id: [modelChange?.id, [SEDML_ID_VALIDATOR]],
      name: [modelChange?.name, []],
      target: [modelChange?.target.value, [Validators.required]],
      default: [modelAttributeChange?.newValue, []],
      newValue: [null, []],
    });
    modelChangeForm.controls.default.disable();
    this.formArray.push(modelChangeForm);
  }

  public removeModelChange(iChange: number): void {
    this.formArray.removeAt(iChange);
  }

  public formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  public shouldShowIdError(formGroup: FormGroup): boolean {
    return this.nextClicked && formGroup.hasError('validSedmlId', 'id');
  }

  public shouldShowTargetError(formGroup: FormGroup): boolean {
    return this.nextClicked && formGroup.hasError('required', 'target');
  }
}
