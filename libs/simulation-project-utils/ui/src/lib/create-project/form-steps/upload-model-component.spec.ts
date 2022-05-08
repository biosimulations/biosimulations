import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadModelComponent } from './upload-model.component';
import { OntologyTerm } from '@biosimulations/simulation-project-utils/service';
import { ConfigService } from '@biosimulations/config/angular';
import { MatCardModule } from '@angular/material/card';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('UploadModelComponent', () => {
  let component: UploadModelComponent;
  let fixture: ComponentFixture<UploadModelComponent>;
  let loader: HarnessLoader;

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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadModelComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide all format options in dropdown', async () => {
    const testFormats = [
      createTestOntologyTerm('test format 1'),
      createTestOntologyTerm('test format 2'),
      createTestOntologyTerm('test format 3'),
    ];

    component.modelFormats = testFormats;

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
    const testFormats = [
      createTestOntologyTerm('test format 1'),
      createTestOntologyTerm('test format 2'),
      createTestOntologyTerm('test format 3'),
    ];

    component.modelFormats = testFormats;

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
    const testFormats = [
      createTestOntologyTerm('test format 1'),
      createTestOntologyTerm('test format 2'),
      createTestOntologyTerm('test format 3'),
    ];

    const testUrl = 'http://www.biosimulations.org';

    component.modelFormats = testFormats;

    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.open();
    await selectHarness.clickOptions({ text: 'name: test format 2' });

    const formFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Enter URL for model file' }),
    );
    const inputHarness = await formFieldHarness.getControl(MatInputHarness);
    await inputHarness?.setValue(testUrl);

    const formStepData = component.getFormStepData();

    expect(formStepData?.modelFormat).toBe('id: test format 2');
    expect(formStepData?.modelUrl).toBe(testUrl);
  });

  function createTestOntologyTerm(testString: string): OntologyTerm {
    return {
      id: 'id: ' + testString,
      name: 'name: ' + testString,
      simulators: new Set<string>(),
      disabled: false,
    };
  }
});
