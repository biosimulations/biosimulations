export type FormStepData = Record<string, unknown>;

export interface IFormStepComponent {
  /**
   * Classes implementing IFormStepComponent should expose a nextClicked property. The multi step form component
   * will use this property to store whether the user has clicked next on this step. This property can be used
   * to determine whether to show error warnings that don't appear until the user has tried to advance the form
   * but failed to validate input.
   */
  nextClicked: boolean;
  stepName?: string;
  archiveDetected?: boolean;

  /**
   * Classes implementing IFormStepComponent should populate their form fields with the provided data.
   * @param formStepData Data that should be inserted into this step's fields.
   */
  populateFormFromFormStepData(formStepData: FormStepData): void;

  /**
   * Classes implementing IFormStepComponent should return either null if the step's fields are in an invalid
   * state, or a FormStepData instance representing the data the user inserted.
   */
  getFormStepData(): FormStepData | null;
}
