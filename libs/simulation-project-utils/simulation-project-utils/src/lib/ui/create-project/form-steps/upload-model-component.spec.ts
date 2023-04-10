import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadModelComponent } from './upload-model.component';
import { OntologyTerm } from '../../../../index';
import { ConfigService } from '@biosimulations/config/angular';
import { MatCardModule } from '@angular/material/card';
import { MaterialFileInputModule } from '@biosimulations/material-file-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormStepData } from '../create-project/forms';

describe('UploadModelComponent', () => {
  let component: UploadModelComponent;
  let fixture: ComponentFixture<UploadModelComponent>;
  let loader: HarnessLoader;
  let testFormats: OntologyTerm[];

  const testUrl = 'http://www.biosimulations.org';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadModelComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MaterialFileInputModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadModelComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testFormats = [
      createTestOntologyTerm('test format 1'),
      createTestOntologyTerm('test format 2'),
      createTestOntologyTerm('test format 3'),
    ];
    component.modelFormats = testFormats;
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should provide all format options in dropdown', async () => {
    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.open();
    const options = await selectHarness.getOptions();
    expect(options.length).toBe(testFormats.length);

    testFormats.forEach(async (testFormat: OntologyTerm, index: number): Promise<void> => {
      const optionText = await options[index].getText();
      expect(optionText).toBe(testFormat.name);
    });
  });

  it('should prepopulate when provided formdata', async () => {
    const formStepData = {
      modelFormat: 'id: test format 1',
      modelUrl: 'Fake test url',
    };

    component.populateFormFromFormStepData(formStepData);

    const selectHarness = await loader.getHarness(MatSelectHarness);
    const prepopulatedValue = await selectHarness.getValueText();

    expect(prepopulatedValue).toBe('name: test format 1');

    const formFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Enter URL for model file' }),
    );
    const inputHarness = await formFieldHarness.getControl(MatInputHarness);
    const prepopulatedUrl = await inputHarness?.getValue();

    expect(prepopulatedUrl).toBe('Fake test url');
  });

  it('should output FormStepData when valid format and url entered', async () => {
    await clickOption('name: test format 2');

    await insertUrl(testUrl);

    const formStepData = clickNext();

    expect(formStepData?.modelFormat).toBe('id: test format 2');
    expect(formStepData?.modelUrl).toBe(testUrl);
  });

  it('should display error when no model format is selected', async () => {
    await insertUrl(testUrl);

    const outputData = clickNext();

    expect(outputData).toBe(null);

    const selectHarness = await loader.getHarness(MatSelectHarness);
    let formatValidity = await selectHarness.isValid();
    expect(formatValidity).toBe(false);

    await clickOption('name: test format 2');

    formatValidity = await selectHarness.isValid();
    expect(formatValidity).toBe(true);
  });

  it('should display error when no model file or url provided', async () => {
    await clickOption('name: test format 2');

    let outputData = clickNext();

    expect(outputData).toBe(null);

    let errorMessage = fixture.debugElement.query((el) => el.name === 'mat-error');
    expect(errorMessage).toBeTruthy();

    await insertUrl(testUrl);

    outputData = clickNext();
    expect(outputData).toBeTruthy();

    errorMessage = fixture.debugElement.query((el) => el.name === 'mat-error');
    expect(errorMessage).toBeFalsy();
  });

  async function insertUrl(url: string): Promise<void> {
    const formFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Enter URL for model file' }),
    );
    const inputHarness = await formFieldHarness.getControl(MatInputHarness);
    await inputHarness?.setValue(url);
  }

  async function clickOption(option: string): Promise<void> {
    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.open();
    await selectHarness.clickOptions({ text: option });
  }

  function clickNext(): FormStepData | null {
    component.nextClicked = true;
    fixture.detectChanges();
    return component.getFormStepData();
  }

  function createTestOntologyTerm(testString: string): OntologyTerm {
    return {
      id: 'id: ' + testString,
      name: 'name: ' + testString,
      simulators: new Set<string>(),
      disabled: false,
    };
  }
});
