import { Component } from '@angular/core';
import { IFormStepComponent, FormStepData } from '@biosimulations/shared/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'biosimulations-preselected-options',
  templateUrl: './preselected-options.component.html',
  styleUrls: ['../dispatch/dispatch.component.scss'],
})
export class PreselectedOptionsComponent implements IFormStepComponent {
  public nextClicked = false;
  public modifyEnabled = false;
  public projectUrl?: string;
  public simulator?: string;
  public simulatorVersion?: string;

  public constructor(private router: Router) {}

  public setup(modifyEnabled: boolean, projectUrl?: string, simulationToolData?: FormStepData): void {
    this.modifyEnabled = modifyEnabled;
    this.projectUrl = projectUrl;
    this.simulator = simulationToolData?.simulator as string;
    this.simulatorVersion = simulationToolData?.simulatorVersion as string;
  }

  public populateFormFromFormStepData(_formStepData: FormStepData): void {
    return;
  }

  public getFormStepData(): FormStepData {
    return {};
  }

  public async resetFormClicked(): Promise<void> {
    await this.router.navigate(['/runs/new']);
    location.reload();
  }

  public modifyArchiveClicked(): void {
    const queryParams = { projectUrl: this.projectUrl };
    this.router.navigate(['/runs/modify'], { queryParams: queryParams });
  }
}
