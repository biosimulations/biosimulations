import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, Validators, UntypedFormGroup, AbstractControl } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import { UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR, SEDML_ID_VALIDATOR } from '@biosimulations/shared/ui';
import { SedModelAttributeChangeTypeEnum, SedModelChange } from '@biosimulations/combine-api-angular-client';

@Component({
  selector: 'create-project-model-changes',
  templateUrl: './model-changes.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class ModelChangesComponent implements IFormStepComponent {
  public nextClicked = false;
  public formArray: UntypedFormArray;

  public constructor(private formBuilder: UntypedFormBuilder) {
    this.formArray = formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
    const defaultRowCount = 3;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelChangeField();
    }
  }

  /**
   * Preloads any model changes parsed out of the uploaded SedDocument into the form.
   * @param introspectedModelChanges SedModelChange instances parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedModelChanges(introspectedModelChanges: SedModelChange[]): void {
    if (introspectedModelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    introspectedModelChanges.forEach((change: SedModelChange) => {
      this.addFieldForModelChange(change);
    });
  }

  /**
   * Loads any previously entered data back into the form. This will be called immediately before the
   * form step appears. Edited fields will overwrite model changes loaded via introspection.
   * @param formStepData Data containing the previously entered model changes.
   */
  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelChanges = formStepData.modelChanges as Record<string, string>[];
    if (!modelChanges || modelChanges.length === 0) {
      console.log(`no model changes, returning`);
      return;
    }
    this.formArray.clear();
    modelChanges.forEach((modelChange: Record<string, string>): void => {
      console.log(`a change getting added: ${modelChange}`);
      this.addModelChangeField(modelChange);
    });
  }

  public getFormStepData(): FormStepData | null {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      console.log(`change not valid.`);
      return null;
    }
    const modelChanges: Record<string, string>[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as UntypedFormGroup;
      console.log(`--- THE MODEL CHANGES IN FORM STEP DDATA: ${formGroup.controls.default.value}`);
      modelChanges.push({
        id: formGroup.value.id,
        name: formGroup.value.name,
        newValue: formGroup.value.newValue,
        target: formGroup.value.target,
        default: formGroup.controls.default.value,
      });
    });
    return {
      modelChanges: modelChanges,
    };
  }

  public removeModelChangeField(index: number): void {
    this.formArray.removeAt(index);
  }

  public formGroups(): UntypedFormGroup[] {
    return this.formArray.controls as UntypedFormGroup[];
  }

  public shouldShowIdError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('validSedmlId', 'id');
  }

  public shouldShowTargetError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('required', 'target');
  }

  public addModelChangeField(modelChange?: Record<string, string | null>): void {
    console.log(`---- A MODEL CHANGE IS: ${modelChange?.newValue}`);
    const modelChangeForm = this.formBuilder.group({
      id: [modelChange?.id, [SEDML_ID_VALIDATOR]],
      name: [modelChange?.name, []],
      target: [modelChange?.target, [Validators.required]],
      default: [modelChange?.default, []],
      newValue: [modelChange?.newValue, []],
    });
    modelChangeForm.controls.default.disable();
    this.formArray.push(modelChangeForm);
  }

  private addFieldForModelChange(modelChange: SedModelChange): void {
    // TODO: Support additional change types.
    if (modelChange && modelChange._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      console.log(`change not added**********************`);
      return;
    }
    this.addModelChangeField({
      id: modelChange.id || null,
      name: modelChange.name || null,
      target: modelChange.target.value || null,
      default: modelChange.newValue || null,
      newValue: null,
    });
  }
}
