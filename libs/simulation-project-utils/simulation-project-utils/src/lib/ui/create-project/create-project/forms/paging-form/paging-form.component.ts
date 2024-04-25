import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  ViewChildren,
  OnDestroy,
  AfterViewInit,
  QueryList,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { IFormStepComponent } from '../form-step-component';
import { IMultiStepFormDataSource } from '../multi-step-form-datasource';
import { IMultiStepFormDataTask } from '../multi-step-form-datasource';
import { IMultiStepFormButton } from '../multi-step-form-datasource';
import { FormHostDirective } from '../form-host.directive';

@Component({
  selector: 'paging-form',
  templateUrl: './paging-form.component.html',
  styleUrls: ['./paging-form.component.scss'],
})
export class PagingFormComponent<TStepId extends string> implements OnDestroy, OnInit, AfterViewInit {
  @ViewChildren(FormHostDirective) public formHostQuery!: QueryList<FormHostDirective>;
  @ViewChild('nextButton') nextButton!: ElementRef;

  @Input() public dataSource?: IMultiStepFormDataSource<TStepId>;
  @Input() public isReRun? = false;

  public shouldShowSpinner = false;
  public loadingText: string | null = null;
  public currentExtraButtons!: IMultiStepFormButton[] | null;
  public subscriptions: Subscription[] = [];
  public fileUploadComponent!: IFormStepComponent;

  private currentFormStepComponent: IFormStepComponent | null = null;
  private formPath: TStepId[] = [];

  // Lifecycle

  public ngOnInit() {}

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public ngAfterViewInit(): void {
    // ngAfterViewInit occurs during the change detection pass, so to make further changes to view it's
    // necessary to push off to the next turn of the run loop via setTimeout.
    // See https://angular.io/errors/NG0100
    const loadContent = (): void => {
      setTimeout(() => {
        this.loadCurrentFormStep();
        if (this.isReRun) {
          console.log(`starting. Is rerun: ${this.isReRun}`);
          this.clickNextButton();
        }
      });
    };
    loadContent();
    const subscription = this.formHostQuery.changes.subscribe((_: QueryList<FormHostDirective>) => {
      loadContent();
    });
    this.subscriptions.push(subscription);

    if (!this.nextButton) {
      console.log(`no next button!`);
    }
  }

  private clickNextButton(): void {
    // Ensure that nextButton is defined and accessible
    if (this.nextButton && this.nextButton.nativeElement) {
      this.nextButton.nativeElement.click();
    } else {
      // Optionally, handle the case where the button is not available
      console.warn('Next button was not available to click programmatically.');
    }
  }

  // Template callbacks

  public shouldShowBackButton(): boolean {
    const showingSpinner = this.currentFormStepComponent === null;
    return !showingSpinner && this.formPath.length > 0;
  }

  public shouldShowNextButton(): boolean {
    if (!this.dataSource) {
      return false;
    }
    const showingSpinner = this.currentFormStepComponent === null;
    return !showingSpinner && this.hasNextStep();
  }

  public onBackClicked(): void {
    const currentStep = this.currentFormStep();
    if (!currentStep || !this.dataSource) {
      return;
    }
    delete this.dataSource.formData[currentStep];
    this.formPath.pop();
    this.loadCurrentFormStep();
  }

  public onNextClicked(): void {
    const stepValidated = this.validateAndSaveStepData();
    const currentStep = this.currentFormStep();
    if (!stepValidated || !this.dataSource || !currentStep) {
      return;
    }

    this.formPath.push(currentStep);
    this.formPath.forEach((stepId: TStepId, i: number) => {
      console.log(`THE FORM PATH: ${i}: ${stepId}`);
    });
    const task = this.dataSource.startDataTask(currentStep);
    if (task) {
      this.showSpinner(task);
    } else {
      this.loadCurrentFormStep();
    }
  }

  public onExtraButtonClicked(button: IMultiStepFormButton): void {
    const stepValidated = this.validateAndSaveStepData();
    if (stepValidated) {
      button.onClick();
    }
  }

  private validateAndSaveStepData(): boolean {
    if (!this.currentFormStepComponent || !this.dataSource) {
      return false;
    }
    this.currentFormStepComponent.nextClicked = true;
    const currentStep = this.currentFormStep();
    const currentStepData = this.currentFormStepComponent?.getFormStepData();
    if (!currentStepData || !currentStep) {
      return false;
    }
    this.dataSource.formData[currentStep] = currentStepData;
    return true;
  }

  private showSpinner(task: IMultiStepFormDataTask): void {
    this.currentFormStepComponent = null;
    this.currentExtraButtons = null;
    this.shouldShowSpinner = true;
    this.loadingText = task.spinnerLabel;
    const spinnerSub = task.completionObservable.subscribe((): void => {
      this.shouldShowSpinner = false;
      this.loadingText = null;
      this.loadCurrentFormStep();
    });
    this.subscriptions.push(spinnerSub);
  }

  // Form paging logic

  private loadCurrentFormStep(): void {
    const currentStep = this.currentFormStep();
    const formHost = this.formHostQuery.first;
    if (!this.dataSource || !formHost || !currentStep) {
      return;
    }
    const formContainerRef = formHost.viewContainerRef;
    formContainerRef.clear();
    this.currentFormStepComponent = this.dataSource.createFormStepComponent(currentStep, formContainerRef);
    this.currentExtraButtons = this.dataSource.extraButtonsForFormStep(currentStep);
    const currentData = this.dataSource.formData[currentStep];
    if (this.currentFormStepComponent && currentData) {
      this.currentFormStepComponent.populateFormFromFormStepData(currentData);
      this.fileUploadComponent = this.currentFormStepComponent;
    }
    console.log(`load current form step!`);
    console.log(`form step: ${this.isReRun}`);
  }

  private currentFormStep(): TStepId | null {
    const formSteps = this.dataSource?.formStepIds();
    if (!this.dataSource || !formSteps || formSteps.length === 0) {
      return null;
    }

    let prevIndex = -1;
    if (this.formPath.length > 0) {
      const prevStep = this.formPath[this.formPath.length - 1];
      prevIndex = formSteps.indexOf(prevStep);
    }

    for (let i = prevIndex + 1; i < formSteps.length; i++) {
      const potentialStep = formSteps[i];
      if (this.dataSource.shouldShowFormStep(potentialStep)) {
        return potentialStep;
      }
    }

    return null;
  }

  private hasNextStep(): boolean {
    const formSteps = this.dataSource?.formStepIds();
    const currentStep = this.currentFormStep();
    if (!currentStep || !this.dataSource || !formSteps || formSteps.length === 0) {
      return false;
    }

    const stepIndex = formSteps.indexOf(currentStep);
    for (let i = stepIndex + 1; i < formSteps.length; i++) {
      const potentialStep = formSteps[i];
      if (this.dataSource.shouldShowFormStep(potentialStep)) {
        return true;
      }
    }

    return false;
  }
}
