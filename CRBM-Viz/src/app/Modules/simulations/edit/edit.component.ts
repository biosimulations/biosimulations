import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, pluck, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AccessLevel, accessLevels } from 'src/app/Shared/Enums/access-level';
import { License, licenses } from 'src/app/Shared/Enums/license';
import { Algorithm } from 'src/app/Shared/Models/algorithm';
import { AlgorithmParameter } from 'src/app/Shared/Models/algorithm-parameter';
import { Model } from 'src/app/Shared/Models/model';
import { ModelParameter } from 'src/app/Shared/Models/model-parameter';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { Simulator } from 'src/app/Shared/Models/simulator';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

enum Mode {
  new = 'new',
  newOfModel = 'newOfModel',
  fork = 'fork',
  edit = 'edit',
}

// tslint:disable:max-line-length

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  models: Observable<Model[]>;
  modelParameters: ModelParameter[];
  algorithms: Observable<Algorithm[]>;
  algorithmParameters: AlgorithmParameter[];
  simulators: Observable<Simulator[]>;
  accessLevels = accessLevels;
  licenses = licenses;
  readonly chipSeparatorKeyCodes: number[] = [ENTER];

  private mode: Mode;
  modelInputDisabled: boolean;
  simulationInputsDisabled: boolean;
  private url: UrlSegment[];
  private id: string;
  private modelId: string;
  simulation: Simulation;
  formGroup: FormGroup;
  model: Model;
  algorithm: Algorithm;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: MetadataService,
    private modelService: ModelService,
    private simulationService: SimulationService
  ) {
    this.formGroup = this.formBuilder.group({
      model: [''],
      name: [''],
      image: [''],
      description: [''],
      tags: this.formBuilder.array([]),
      modelParameterChanges: this.formBuilder.array([]),
      startTime: [''],
      endTime: [''],
      algorithm: [''],
      algorithmParameterChanges: this.formBuilder.array([]),
      simulator: [''],
      numTimePoints: [''],
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
    });
  }

  ngOnInit() {
    this.formGroup.get('model').valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => {
        this.models = this.modelService.list(value);
      })
    );
    this.algorithms = this.formGroup.get('algorithm').valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => this.metadataService.getAlgorithms(value))
    );
    this.simulators = this.formGroup.get('simulator').valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => this.metadataService.getSimulators(value))
    );

    this.route.params.subscribe(params => {
      this.url = this.route.snapshot.url;
      this.id = params.id;
      this.modelId = params.modelId;
      this.setUp();
    });
  }

  setUp(): void {
    // determine mode: new, new of a model, edit, fork
    if (this.modelId) {
      // new simulation of a model
      this.mode = Mode.newOfModel;
    } else if (this.id) {
      if (this.url.length > 1 && this.url[1].path === 'fork') {
        this.mode = Mode.fork;
      } else {
        this.mode = Mode.edit;
      }
    } else {
      // new simulation
      this.mode = Mode.new;
    }

    // get data
    if (this.id) {
      this.simulationService
        .read(this.id)
        .subscribe(simulation => (this.simulation = simulation));
    }
    if (this.modelId) {
      this.modelService
        .read(this.modelId)
        .subscribe(model => (this.model = model));
    }

    // bread crumbs and buttons
    const crumbs: object[] = [
      { label: 'Simulations', route: ['/simulations'] },
    ];
    switch (this.mode) {
      case Mode.new:
        crumbs.push({
          label: 'New',
        });
        break;
      case Mode.newOfModel:
        crumbs.push({
          label: 'Model ' + this.model.id,
        });
        crumbs.push({
          label: 'New',
        });
        break;
      case Mode.fork:
        crumbs.push({
          label: 'Simulation ' + this.id,
          route: ['/simulations', this.id],
        });
        crumbs.push({
          label: 'Fork',
        });
        break;
      case Mode.edit:
        crumbs.push({
          label: 'Simulation ' + this.id,
          route: ['/simulations', this.id],
        });
        crumbs.push({
          label: 'Edit',
        });
        break;
    }

    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'paint-brush',
        label: 'Visualize',
        route: ['/visualizations', this.id],
        display:
          this.mode === Mode.edit
            ? NavItemDisplayLevel.always
            : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'bars',
        label: 'View',
        route: ['/simulations', this.id],
        display:
          this.mode === Mode.edit
            ? NavItemDisplayLevel.always
            : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'code-branch',
        label: 'Fork',
        route: ['/simulations', this.id, 'fork'],
        display:
          this.mode === Mode.edit
            ? NavItemDisplayLevel.always
            : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'trash-alt',
        label: 'Delete',
        click: () => {
          this.openDeleteDialog();
        },
        display:
          this.mode === Mode.edit &&
          this.simulation &&
          this.simulation.access === AccessLevel.private
            ? NavItemDisplayLevel.user
            : NavItemDisplayLevel.never,
        displayUser: !!this.simulation ? this.simulation.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/simulations', 'new'],
        display:
          this.mode === Mode.new
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your simulations',
        route: ['/user', 'simulations'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/simulations'],
        display: NavItemDisplayLevel.always,
      },
    ];

    this.breadCrumbsService.set(crumbs, buttons);

    // set field enable/disabled
    this.modelInputDisabled =
      this.mode === Mode.edit || this.mode === Mode.newOfModel;
    if (this.modelInputDisabled) {
      this.formGroup.get('model').disable();
    } else {
      this.formGroup.get('model').enable();
    }

    this.simulationInputsDisabled = this.mode === Mode.edit;
    if (this.simulationInputsDisabled) {
      this.formGroup.get('modelParameterChanges').disable();
      this.formGroup.get('startTime').disable();
      this.formGroup.get('endTime').disable();
      this.formGroup.get('numTimePoints').disable();
      this.formGroup.get('algorithm').disable();
      this.formGroup.get('algorithmParameterChanges').disable();
      this.formGroup.get('simulator').disable();
    } else {
      this.formGroup.get('modelParameterChanges').enable();
      this.formGroup.get('startTime').enable();
      this.formGroup.get('endTime').enable();
      this.formGroup.get('numTimePoints').enable();
      this.formGroup.get('algorithm').enable();
      this.formGroup.get('algorithmParameterChanges').enable();
      this.formGroup.get('simulator').enable();
    }

    // populate form
    if (this.modelId) {
      this.formGroup.patchValue({ model: this.model });
    }

    if (this.id) {
      this.getFormArray('tags').clear();
      this.getFormArray('modelParameterChanges').clear();
      this.getFormArray('algorithmParameterChanges').clear();
      this.getFormArray('authors').clear();
      this.getFormArray('identifiers').clear();
      this.getFormArray('refs').clear();
      this.getFormArray('modelParameterChanges');

      for (const el of this.simulation.tags) {
        this.addTagFormElement();
      }
      for (const el of this.simulation.modelParameterChanges) {
        this.addModelParameterChangeFormElement();
      }
      for (const el of this.simulation.algorithmParameterChanges) {
        this.addAlgorithmParameterChangeFormElement();
      }
      for (const el of this.simulation.authors) {
        this.addAuthorFormElement();
      }
      for (const el of this.simulation.identifiers) {
        this.addIdentifierFormElement();
      }
      for (const el of this.simulation.refs) {
        this.addRefFormElement();
      }
      this.modelService
        .read(this.simulation.MODEL)
        .subscribe(model => (this.model = model));
      this.algorithm = this.simulation.algorithm;
      this.formGroup.patchValue(this.simulation);
      for (const changeFormGroup of this.getFormArray('modelParameterChanges')
        .controls) {
        const parameter = changeFormGroup.value.parameter;
        changeFormGroup.patchValue({
          defaultValue: parameter.value,
          units: parameter.units,
        });
      }
      for (const changeFormGroup of this.getFormArray(
        'algorithmParameterChanges'
      ).controls) {
        const parameter = changeFormGroup.value.parameter;
        changeFormGroup.patchValue({
          defaultValue: parameter.value,
        });
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // this.addTagFormElement();
        // this.addModelParameterChangeFormElement();
        // this.addAlgorithmParameterChangeFormElement();
        this.addAuthorFormElement();
        this.addIdentifierFormElement();
        this.addRefFormElement();
      }
    }
  }

  getModelParameters(value: string): void {
    this.modelParameters = this.modelService.getParameters(this.model, value);
  }

  getAlgorithmParameters(value: string): void {
    this.algorithmParameters = this.metadataService.getAlgorithmParameters(
      this.algorithm,
      value
    );
  }

  getFormArray(array: string): FormArray {
    return this.formGroup.get(array) as FormArray;
  }

  selectFile(controlName: string, files: File[], fileNameEl): void {
    let file: File;
    let fileName: string;
    if (files.length) {
      file = files[0];
      fileName = file.name;
    } else {
      file = null;
      fileName = '';
    }
    const value: object = {};
    value[controlName] = file;
    this.formGroup.patchValue(value);
    fileNameEl.innerHTML = fileName;
  }

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
  }

  displayAutocompleteParameter(
    parameter: ModelParameter | AlgorithmParameter
  ): string | undefined {
    return parameter ? parameter.id + ': ' + parameter.name : undefined;
  }

  selectAutocomplete(formControl: AbstractControl, required = false): void {
    const value = formControl.value;
    if (required && (typeof value === 'string' || value === null)) {
      formControl.setErrors({ incorrect: true });
    } else if (!required && typeof value === 'string' && value !== '') {
      formControl.setErrors({ incorrect: true });
    } else {
      if (value === '') {
        formControl.patchValue(null);
      }
      formControl.setErrors(null);
    }
  }

  selectAutocompleteModel(formControl: AbstractControl): void {
    this.model = this.formGroup.value.model;
    this.selectAutocomplete(formControl, true);

    this.formGroup.patchValue({ modelParameterChanges: [] });

    const controls = this.getFormArray('modelParameterChanges').controls;
    controls.splice(0, controls.length);

    this.addModelParameterChangeFormElement();
    this.addModelParameterChangeFormElement();
    this.addModelParameterChangeFormElement();
  }

  selectAutocompleteModelParameter(formGroup: FormGroup): void {
    const parameterFormControl: FormControl = formGroup.get(
      'parameter'
    ) as FormControl;
    this.selectAutocomplete(parameterFormControl, true);

    const parameter = parameterFormControl.value;
    let defaultValue: number;
    let units = '';
    if (parameter instanceof ModelParameter) {
      defaultValue = parameter.value;
      units = parameter.units;
    }

    formGroup.patchValue({
      defaultValue,
      value: '',
      units,
    });
  }

  selectAutocompleteAlgorithm(formControl: AbstractControl): void {
    this.algorithm = this.formGroup.value.algorithm;
    this.selectAutocomplete(formControl, true);
    this.formGroup.patchValue({ algorithmParameterChanges: [] });

    const controls = this.getFormArray('algorithmParameterChanges').controls;
    controls.splice(0, controls.length);

    this.addAlgorithmParameterChangeFormElement();
    this.addAlgorithmParameterChangeFormElement();
    this.addAlgorithmParameterChangeFormElement();
  }

  selectAutocompleteAlgorithmParameter(formGroup: FormGroup): void {
    const parameterFormControl: FormControl = formGroup.get(
      'parameter'
    ) as FormControl;
    this.selectAutocomplete(parameterFormControl, true);

    const parameter = parameterFormControl.value;
    let defaultValue: number;
    if (parameter instanceof AlgorithmParameter) {
      defaultValue = parameter.value;
    }

    formGroup.patchValue({
      defaultValue,
      value: '',
    });
  }

  addTagFormElement(): void {
    const formArray: FormArray = this.getFormArray('tags');
    formArray.push(this.formBuilder.control(''));
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    let value: string = event.value;

    // Add tag
    value = (value || '').trim();
    if (value && !this.formGroup.value.tags.includes(value)) {
      const formArray: FormArray = this.getFormArray('tags');
      formArray.push(this.formBuilder.control(value));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeFormArrayElement(array: string, iEl: number): void {
    const formArray: FormArray = this.getFormArray(array);
    formArray.removeAt(iEl);
  }

  addModelParameterChangeFormElement(): void {
    const formArray: FormArray = this.getFormArray('modelParameterChanges');
    formArray.push(
      this.formBuilder.group({
        parameter: { value: null, disabled: this.mode === Mode.edit },
        defaultValue: { value: null, disabled: true },
        value: { value: null, disabled: this.mode === Mode.edit },
        units: { value: null, disabled: true },
      })
    );
  }

  addAlgorithmParameterChangeFormElement(): void {
    const formArray: FormArray = this.getFormArray('algorithmParameterChanges');
    formArray.push(
      this.formBuilder.group({
        parameter: { value: null, disabled: this.mode === Mode.edit },
        defaultValue: { value: null, disabled: true },
        value: { value: null, disabled: this.mode === Mode.edit },
      })
    );
  }

  addAuthorFormElement(): void {
    const formArray: FormArray = this.getFormArray('authors');
    formArray.push(
      this.formBuilder.group({
        firstName: [''],
        middleName: [''],
        lastName: [''],
      })
    );
  }

  addIdentifierFormElement(): void {
    const formArray: FormArray = this.getFormArray('identifiers');
    formArray.push(
      this.formBuilder.group({
        namespace: [''],
        id: [''],
      })
    );
  }

  addRefFormElement(): void {
    const formArray: FormArray = this.getFormArray('refs');
    formArray.push(
      this.formBuilder.group({
        authors: [''],
        title: [''],
        journal: [''],
        volume: [''],
        num: [''],
        pages: [''],
        year: [''],
        doi: [''],
      })
    );
  }

  drop(formArray: FormArray, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      formArray.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  submit() {
    const data: Simulation = this.formGroup.value as Simulation;
    if (this.mode === Mode.fork) {
      data.parent = this.simulation;
    }
    const simulation: Observable<Simulation> = this.simulationService.update(
      data
    );
    simulation.pipe(
      pluck('id'),
      tap(id => {
        this.snackBar.open('Simulation saved', '', {
          panelClass: 'centered-snack-bar',
          duration: 3000,
        });

        setTimeout(() => {
          this.router.navigate(['/simulations', id]);
        }, 2500);
      })
    );
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete simulation ${this.id}?`,
        action: () => {
          this.simulationService.delete(this.id);
          this.router.navigate(['/simulations']);
        },
      },
    });
  }
}
