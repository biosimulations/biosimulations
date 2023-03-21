import { IFormStepComponent, FormStepData } from './form-step-component';
import { ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Wraps an observable for a task that must complete after a form step completes, and a label to display
 * below the spinner while the task resolves.
 */
export interface IMultiStepFormDataTask {
  completionObservable: Observable<void>;
  spinnerLabel: string;
}

/**
 * Defines a button to display on the bottom right side of a form step.
 */
export interface IMultiStepFormButton {
  label: string;
  onClick: () => void;
}

/**
 * Provides the data necessary to configure a multi step form.
 */
export interface IMultiStepFormDataSource<TStepId extends string> {
  /**
   * The MultiStepFormDataSource should update the data for the requested step. When null data is provided
   * the form step data should be cleared entirely.
   *
   * @param stepId The form step for which to update data.
   * @param data The data that should be set for the form step.
   */
  setDataForStep(stepId: TStepId, data: FormStepData | null): void;

  /**
   * The MultiStepFormDataSource should provide the data for the requested step.
   *
   * @param stepId The form step for which to return data.
   */
  getDataForStep(stepId: TStepId): FormStepData | null;

  /**
   * The MultiStepFormDataSource should return a list of identifiers representing the steps of the form.
   * Components will be fetched and displayed from this list in order. This function should always return all
   * steps, shouldShowFormStep should be used for conditional steps.
   */
  formStepIds(): TStepId[];

  /**
   * The MultiStepFormDataSource should return true if the step is valid based on the current state of the form and should
   * be shown, and false if the step is not valid based on the current state and should be skipped.
   *
   * @param stepId The id of the form step that will be conditionally displayed based on the return value.
   */
  shouldShowFormStep(stepId: TStepId): boolean;

  /**
   * The MultiStepFormDataSource should return an instance of IFormStepComponent representing the step of the form keyed
   * by formId, added within hostView.
   *
   * @param stepId The id of the form step to display.
   * @param hostView The host view that the form step should be created upon.
   */
  createFormStepComponent(stepId: TStepId, hostView: ViewContainerRef): IFormStepComponent;

  /**
   * The MultiStepFormDataSource should perform whatever configuration is necessary on the IFormStepComponent to make it
   * compatible with the current state of the form data.
   *
   * @param stepId The id of the step to configure.
   * @param stepComponent The component to configure.
   */
  configureFormStepComponent(stepId: TStepId, stepComponent: IFormStepComponent): void;

  /**
   * The MultiStepFormDataSource should either return null or a MultiStepFormDataTask representing work to process
   * the specified step's inputed data.
   *
   * @param stepId The step that was just submitted and whose data is ready to be processed.
   */
  startDataTask(stepId: TStepId): IMultiStepFormDataTask | null;

  /**
   * The MultiStepFormDataSource should return either null or a list of MultiStepFormButton instances. The provided
   * buttons will be displayed in order on the bottom right side of the form step component. This value is only
   * respected on multi page forms.
   *
   * @param formStepId The id of the step for which the buttons should be displayed.
   */
  extraButtonsForFormStep?(formStepId: TStepId): IMultiStepFormButton[] | null;

  /**
   * The MultiStepFormDataSource should return either null or a MultiStepFormButton instance. The provided
   * button will be displayed on the bottom right side of the form. This value is only respected for single
   * page forms.
   */
  submitButtonForForm?(): IMultiStepFormButton;
}
