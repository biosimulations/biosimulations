import { Subscription } from 'rxjs';
import { Component, Input, ViewChildren, OnDestroy, AfterViewInit, QueryList } from '@angular/core';
import { IMultiStepFormDataSource, FormHostDirective, IFormStepComponent, IMultiStepFormButton } from '..';
import { IMultiStepFormDataTask } from '../multi-step-form-datasource';

@Component({
  selector: 'single-page-form',
  templateUrl: './single-page-form.component.html',
  styleUrls: ['./single-page-form.component.scss'],
})
export class SinglePageFormComponent<TStepId extends string> implements OnDestroy, AfterViewInit {
  @ViewChildren(FormHostDirective) public formHostQuery!: QueryList<FormHostDirective>;

  @Input() public dataSource?: IMultiStepFormDataSource<TStepId>;

  public submitButton?: IMultiStepFormButton;

  private formStepComponents: Record<TStepId, IFormStepComponent> = <Record<TStepId, IFormStepComponent>>{};
  private subscriptions: Subscription[] = [];
  private updateInProgress = false; // Prevents recursive updates.

  // Lifecycle

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public ngAfterViewInit(): void {
    // ngAfterViewInit occurs during the change detection pass, so to make further changes to view it's
    // necessary to push off to the next turn of the run loop via setTimeout.
    // See https://angular.io/errors/NG0100
    const loadContent = (): void => {
      setTimeout(() => {
        this.loadFormSteps();
      });
    };
    loadContent();
    const subscription = this.formHostQuery.changes.subscribe((_: QueryList<FormHostDirective>) => {
      loadContent();
    });
    this.subscriptions.push(subscription);
  }

  public onSubmit(): void {
    if (!this.dataSource || !this.submitButton) {
      return;
    }

    let containsInvalidStep = false;

    for (const stepComponent of Object.values<IFormStepComponent>(this.formStepComponents)) {
      stepComponent.nextClicked = true;
      const stepTag = stepComponent.stepTag as TStepId;
      const stepData = stepComponent.getFormStepData();
      containsInvalidStep = containsInvalidStep || stepData == null;
      this.dataSource.setDataForStep(stepTag, stepData);
    }

    if (containsInvalidStep) {
      return;
    }

    this.submitButton.onClick();
  }

  private loadFormSteps(): void {
    const formHost = this.formHostQuery.first;
    if (!this.dataSource || !formHost) {
      return;
    }

    const formContainerRef = formHost.viewContainerRef;

    const stepIds = this.dataSource.formStepIds();
    for (const stepId of stepIds) {
      const component = this.dataSource.createFormStepComponent(stepId, formContainerRef);
      component.stepTag = stepId;
      component.updateCallback = this.formStepUpdated.bind(this);
      this.formStepComponents[stepId] = component;
    }

    if (this.dataSource.submitButtonForForm) {
      this.submitButton = this.dataSource.submitButtonForForm();
    }

    this.updateInProgress = true;
    this.reconfigureSteps();
    // Data may be preloaded, so we need to get and start any data tasks on load.
    const initialTasks: IMultiStepFormDataTask[] = [];
    for (const stepId of stepIds) {
      const component = this.formStepComponents[stepId];
      const stepData = component.getFormStepData();
      const dataIsValid = stepData !== null;
      const dataTask = dataIsValid ? this.dataSource.startDataTask(stepId) : null;
      if (dataTask) {
        initialTasks.push(dataTask);
      }
    }
    this.updateInProgress = false;

    for (const task of initialTasks) {
      const subscription = task.completionObservable.subscribe(() => {
        this.updateInProgress = true;
        this.reconfigureSteps();
        this.updateInProgress = false;
      });
      this.subscriptions.push(subscription);
    }
  }

  private formStepUpdated(formStepComponent: IFormStepComponent): void {
    if (this.updateInProgress) {
      return;
    }

    formStepComponent.nextClicked = false;

    const stepTag = formStepComponent.stepTag as TStepId;
    const stepData = formStepComponent.getFormStepData();
    if (!this.dataSource || !stepTag) {
      return;
    }

    const dataIsValid = stepData !== null;

    this.updateInProgress = true;

    this.dataSource.setDataForStep(stepTag, stepData);
    this.reconfigureSteps();
    const dataTask = dataIsValid ? this.dataSource.startDataTask(stepTag) : null;

    this.updateInProgress = false;

    if (dataTask) {
      const subscription = dataTask.completionObservable.subscribe(() => {
        this.updateInProgress = true;
        this.reconfigureSteps();
        this.updateInProgress = false;
      });
      this.subscriptions.push(subscription);
    }
  }

  private reconfigureSteps(): void {
    if (!this.dataSource) {
      return;
    }
    for (const [stepKey, stepComponent] of Object.entries(this.formStepComponents)) {
      this.dataSource.configureFormStepComponent(stepKey as TStepId, stepComponent as IFormStepComponent);
    }
  }
}
