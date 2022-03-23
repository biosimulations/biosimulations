export type FormStepData = Record<string, unknown> | undefined;

export interface FormStepComponent {
  nextClicked: boolean;

  populateFormFromFormStepData(formStepData: FormStepData): void;
  getFormStepData(): FormStepData;
}
