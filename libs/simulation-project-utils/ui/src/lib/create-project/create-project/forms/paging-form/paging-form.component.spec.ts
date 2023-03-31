import { ComponentFixture, fakeAsync, TestBed, tick, flush } from '@angular/core/testing';
import { Component, DebugElement, ViewContainerRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import {
  IMultiStepFormDataSource,
  FormStepData,
  IMultiStepFormDataTask,
  IMultiStepFormButton,
  IFormStepComponent,
  FormHostDirective,
  PagingFormComponent,
} from '../index';
import { MaterialWrapperModule } from '../../../../../../../../shared/ui/src/lib/material-wrapper.module';

enum MultiStepFormTestStep {
  TestStepOne = 'TestStepOne',
  TestStepTwo = 'TestStepTwo',
  TestStepThree = 'TestStepThree',
  TestStepFour = 'TestStepFour',
}

@Component({
  selector: 'multi-step-form-test-component',
  template: '<span>Step id: {{ stepId }}</span>',
})
class MultiStepFormTestComponent implements IFormStepComponent {
  public nextClicked = false;
  public stepId?: string;

  public populateFormFromFormStepData(_formStepData: FormStepData): void {}

  public getFormStepData(): FormStepData {
    return {};
  }
}

class MultiStepFormTestDataSource implements IMultiStepFormDataSource<MultiStepFormTestStep> {
  public formData: Record<MultiStepFormTestStep, FormStepData> = <Record<MultiStepFormTestStep, FormStepData>>{};
  public stepsToSkip: MultiStepFormTestStep[] = [];

  public formStepIds(): MultiStepFormTestStep[] {
    return [
      MultiStepFormTestStep.TestStepOne,
      MultiStepFormTestStep.TestStepTwo,
      MultiStepFormTestStep.TestStepThree,
      MultiStepFormTestStep.TestStepFour,
    ];
  }

  public shouldShowFormStep(stepId: MultiStepFormTestStep): boolean {
    return this.stepsToSkip.indexOf(stepId) === -1;
  }

  public createFormStepComponent(stepId: MultiStepFormTestStep, hostView: ViewContainerRef): IFormStepComponent {
    const hostedComponent = hostView.createComponent<MultiStepFormTestComponent>(MultiStepFormTestComponent);
    hostedComponent.instance.stepId = stepId;
    return hostedComponent.instance;
  }

  public startDataTask(_stepId: MultiStepFormTestStep): IMultiStepFormDataTask | null {
    return null;
  }

  public extraButtonsForFormStep(_formStepId: MultiStepFormTestStep): IMultiStepFormButton[] | null {
    return null;
  }
}

describe('PagingFormComponent', () => {
  let component: PagingFormComponent<MultiStepFormTestStep>;
  let fixture: ComponentFixture<PagingFormComponent<MultiStepFormTestStep>>;
  let dataSource: MultiStepFormTestDataSource;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaterialWrapperModule],
      declarations: [PagingFormComponent, MultiStepFormTestComponent, FormHostDirective, MultiStepFormTestStep],
    }).compileComponents();
  }));

  it('should create', fakeAsync(() => {
    fixture = TestBed.createComponent(PagingFormComponent<MultiStepFormTestStep>) as ComponentFixture<
      PagingFormComponent<MultiStepFormTestStep>
    >;
    dataSource = new MultiStepFormTestDataSource();
    component = fixture.componentInstance;
    component.dataSource = dataSource;
    // One change detection cycle is required for the view to init and form host to be queried.
    // Another is required to update the form buttons in response to the inserted step component.
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should initially load only the first form step', fakeAsync(() => {
    fixture = TestBed.createComponent(PagingFormComponent<MultiStepFormTestStep>) as ComponentFixture<
      PagingFormComponent<MultiStepFormTestStep>
    >;
    dataSource = new MultiStepFormTestDataSource();
    component = fixture.componentInstance;
    component.dataSource = dataSource;
    // One change detection cycle is required for the view to init and form host to be queried.
    // Another is required to update the form buttons in response to the inserted step component.
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expectStepOne();
  }));

  // it('should advance through steps on next clicks', fakeAsync(() => {
  //   expectStepOne();
  //   clickNext();
  //   expectStepTwo();
  //   clickNext();
  //   expectStepThree();
  //   clickNext();
  //   expectStepFour();
  // }));
  //
  // it('should back up through steps on back clicks', fakeAsync(() => {
  //   clickNext();
  //   clickNext();
  //   clickNext();
  //   expectStepFour();
  //   clickBack();
  //   expectStepThree();
  //   clickBack();
  //   expectStepTwo();
  //   clickBack();
  //   expectStepOne();
  // }));
  //
  // it('should hide back and next buttons on first and last step respectively', fakeAsync(() => {
  //   let nextButton = getNextButton();
  //   expect(nextButton).toBeTruthy();
  //
  //   let backButton = getBackButton();
  //   expect(backButton).toBeFalsy();
  //
  //   clickNext();
  //
  //   nextButton = getNextButton();
  //   expect(nextButton).toBeTruthy();
  //
  //   backButton = getBackButton();
  //   expect(backButton).toBeTruthy();
  //
  //   clickNext();
  //   clickNext();
  //
  //   nextButton = getNextButton();
  //   expect(nextButton).toBeFalsy();
  //
  //   backButton = getBackButton();
  //   expect(backButton).toBeTruthy();
  // }));
  //
  // it('should hide steps for which the datasource return false from shouldShowFormStep', fakeAsync(() => {
  //   dataSource.stepsToSkip = [MultiStepFormTestStep.TestStepThree];
  //   expectStepOne();
  //   clickNext();
  //   expectStepTwo();
  //   clickNext();
  //   expectStepFour();
  // }));
  //
  // function clickNext(): void {
  //   const nextButton = getNextButton();
  //   nextButton.triggerEventHandler('click', null);
  //   //tick();
  //   flush();
  //   fixture.detectChanges();
  // }
  //
  // function clickBack(): void {
  //   const backButton = getBackButton();
  //   backButton.triggerEventHandler('click', null);
  //   //tick();
  //   flush();
  //   fixture.detectChanges();
  // }
  //
  // function getNextButton(): DebugElement {
  //   return fixture.debugElement.query(By.css('#multi-step-form-next')) as DebugElement;
  // }
  //
  // function getBackButton(): DebugElement {
  //   return fixture.debugElement.query(By.css('#multi-step-form-back')) as DebugElement;
  // }
  //
  function expectStepOne(): void {
    const firstComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'TestStepOne');
    const secondComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepTwo');
    const thirdComponent = fixture.debugElement.query(
      (el) => el.nativeElement.textContent === 'Step id: TestStepThree',
    );
    const fourthComponent = fixture.debugElement.query(
      (el) => el.nativeElement.textContent === 'Step id: TestStepFour',
    );
    expect(firstComponent).toBeTruthy();
    expect(secondComponent).toBeFalsy();
    expect(thirdComponent).toBeFalsy();
    expect(fourthComponent).toBeFalsy();
  }

  // function expectStepTwo(): void {
  //   const firstComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepOne');
  //   const secondComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepTwo');
  //   const thirdComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepThree',
  //   );
  //   const fourthComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepFour',
  //   );
  //   expect(firstComponent).toBeFalsy();
  //   expect(secondComponent).toBeTruthy();
  //   expect(thirdComponent).toBeFalsy();
  //   expect(fourthComponent).toBeFalsy();
  // }
  //
  // function expectStepThree(): void {
  //   const firstComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepOne');
  //   const secondComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepTwo');
  //   const thirdComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepThree',
  //   );
  //   const fourthComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepFour',
  //   );
  //   expect(firstComponent).toBeFalsy();
  //   expect(secondComponent).toBeFalsy();
  //   expect(thirdComponent).toBeTruthy();
  //   expect(fourthComponent).toBeFalsy();
  // }
  //
  // function expectStepFour(): void {
  //   const firstComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepOne');
  //   const secondComponent = fixture.debugElement.query((el) => el.nativeElement.textContent === 'Step id: TestStepTwo');
  //   const thirdComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepThree',
  //   );
  //   const fourthComponent = fixture.debugElement.query(
  //     (el) => el.nativeElement.textContent === 'Step id: TestStepFour',
  //   );
  //   expect(firstComponent).toBeFalsy();
  //   expect(secondComponent).toBeFalsy();
  //   expect(thirdComponent).toBeFalsy();
  //   expect(fourthComponent).toBeTruthy();
  // }
});
