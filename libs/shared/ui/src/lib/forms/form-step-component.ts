export type FormStepData = Record<string, unknown>;

export interface IFormStepComponent {
  /**
   * Classes implementing IFormStepComponent should expose a nextClicked property. The multi step form component
   * will use this property to store whether the user has clicked next on this step. This property can be used
   * to determine whether to show error warnings that don't appear until the user has tried to advance the form
   * but failed to validate input.
   */
  nextClicked: boolean;

  /**
   * Classes implementing IFormStepComponent may expose a stepTag property. The multi step form component will
   * use this property to store an identifier for the step associated with the step component.
   */
  stepTag?: string;

  /**
   * Classes implementing IFormStepComponent may expose a updateCallback property. This property will be set by
   * the multi step form component and can by used by the IFormStepComponent to notify the form that its contents
   * have been updated. This function should be called if the contents of the form step will effect the configuration
   * of other steps. In the case of a paging form this will be called automatically on paging, and so is optional.
   */
  updateCallback?: (stepComponent: IFormStepComponent) => void;

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
