import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import {
  POSITIVE_INTEGER_VALIDATOR,
  NON_NEGATIVE_FLOAT_VALIDATOR,
  UNIFORM_TIME_SPAN_VALIDATOR,
} from '@biosimulations/shared/ui';
import { SedUniformTimeCourseSimulation } from '@biosimulations/combine-api-angular-client';

@Component({
  selector: 'create-project-inform-time-course-simulation',
  templateUrl: './uniform-time-course-simulation.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class UniformTimeCourseSimulationComponent implements IFormStepComponent, OnChanges {
  public formGroup: UntypedFormGroup;
  public nextClicked = false;
  public stepSize?: number;

  public constructor(private formBuilder: UntypedFormBuilder) {
    this.formGroup = this.formBuilder.group(
      {
        initialTime: [null, [Validators.required, NON_NEGATIVE_FLOAT_VALIDATOR]],
        outputStartTime: [null, [Validators.required, NON_NEGATIVE_FLOAT_VALIDATOR]],
        outputEndTime: [null, [Validators.required, NON_NEGATIVE_FLOAT_VALIDATOR]],
        numberOfSteps: [null],
        step: [null],
      },
      {
        validators: UNIFORM_TIME_SPAN_VALIDATOR,
      },
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.changeUniformTimeCourseSimulationStep();
  }

  public loadIntrospectedTimeCourseData(timeCourseData: SedUniformTimeCourseSimulation): void {
    this.formGroup.controls.initialTime.setValue(timeCourseData.initialTime);
    this.formGroup.controls.outputStartTime.setValue(timeCourseData.outputStartTime);
    this.formGroup.controls.outputEndTime.setValue(timeCourseData.outputEndTime);
    this.formGroup.controls.numberOfSteps.setValue(timeCourseData.numberOfSteps);
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    this.formGroup.controls.initialTime.setValue(formStepData.initialTime);
    this.formGroup.controls.outputStartTime.setValue(formStepData.outputStartTime);
    this.formGroup.controls.outputEndTime.setValue(formStepData.outputEndTime);
    this.formGroup.controls.numberOfSteps.setValue(formStepData.numberOfSteps);
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    return {
      initialTime: this.formGroup.value.initialTime,
      outputStartTime: this.formGroup.value.outputStartTime,
      outputEndTime: this.formGroup.value.outputEndTime,
      numberOfSteps: this.formGroup.value.numberOfSteps,
    };
  }

  public changeUniformTimeCourseSimulationStep(): void {
    const endTimeValue = this.formGroup.controls.outputEndTime.value;
    const startTimeValue = this.formGroup.controls.outputStartTime.value;
    const numStepsValue = this.formGroup.controls.numberOfSteps.value;
    if (endTimeValue != null && startTimeValue != null && numStepsValue != null) {
      this.stepSize = (endTimeValue - startTimeValue) / numStepsValue;
    }
  }

  public shouldShowRequiredFieldError(): boolean {
    const initialMissing = this.formGroup.hasError('required', 'initialTime');
    const initialInvalid = this.formGroup.hasError('nonNegativeFloat', 'initialTime');
    const startMissing = this.formGroup.hasError('required', 'outputStartTime');
    const startInvalid = this.formGroup.hasError('nonNegativeFloat', 'outputStartTime');
    const endMissing = this.formGroup.hasError('required', 'outputEndTime');
    const endInvalid = this.formGroup.hasError('nonNegativeFloat', 'outputEndTime');
    const stepsMissing = this.formGroup.hasError('required', 'numberOfSteps');
    const missingField = initialMissing || startMissing || endMissing || stepsMissing;
    const invalidField = initialInvalid || startInvalid || endInvalid;
    return this.nextClicked && (missingField || invalidField);
  }

  public shouldShowStepSize(): boolean {
    this.formGroup.updateValueAndValidity();
    return this.stepSize !== undefined && !isNaN(this.stepSize) && this.formGroup.valid;
  }
}
