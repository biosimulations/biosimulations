import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-commercial-solvers',
  templateUrl: './commercial-solvers.component.html',
  styleUrls: ['../dispatch/dispatch.component.scss'],
})
export class CommercialSolversComponent implements IFormStepComponent {
  public formGroup: UntypedFormGroup;
  public exampleCombineArchivesUrl?: string;
  public nextClicked = false;

  public constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      academicPurpose: [false],
    });
  }

  public populateFormFromFormStepData(_formStepData: FormStepData): void {
    return;
  }

  public getFormStepData(): FormStepData {
    return {
      academicPurpose: this.formGroup.controls.academicPurpose.value,
    };
  }
}
