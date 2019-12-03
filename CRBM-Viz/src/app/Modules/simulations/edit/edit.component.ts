import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
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

  id: string;
  formGroup: FormGroup;
  model: Model;
  algorithm: Algorithm;
  showAfterSubmitMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private router: Router,
    private metadataService: MetadataService,
    private modelService: ModelService,
    private simulationService: SimulationService
    ) {
    this.formGroup = this.formBuilder.group({
      model: [''],
      name: [''],
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
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
    });
  }

  ngOnInit() {
    this.models = this.formGroup.get('model').valueChanges
      .pipe(
        startWith(''),
        map(value => value === null || typeof value === 'string' ? value : value.name),
        map(value => this.modelService.list(value))
      );
    this.algorithms = this.formGroup.get('algorithm').valueChanges
      .pipe(
        startWith(''),
        map(value => value === null || typeof value === 'string' ? value : value.name),
        map(value => this.metadataService.getAlgorithms(value))
      );
    this.simulators = this.formGroup.get('simulator').valueChanges
      .pipe(
        startWith(''),
        map(value => value === null || typeof value === 'string' ? value : value.name),
        map(value => this.metadataService.getSimulators(value))
      );

    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      const modelId: string = routeParams.modelId;

      const crumbs: object[] = [
        {label: 'Simulations', route: ['/simulations']},
      ];
      const buttons: NavItem[] = [
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/simulations'],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your simulations',
          route: ['/user', 'simulations'],
          display: NavItemDisplayLevel.loggedIn,
        },
      ];

      let simulation: Simulation;
      if (this.id) {
        simulation = this.simulationService.get(this.id);

        crumbs.push({
          label: 'Simulation ' + this.id,
          route: ['/simulations', this.id],
        });
        crumbs.push({
          label: 'Edit',
        });

        buttons.splice(0, 0, {
          iconType: 'fas',
          icon: 'bars',
          label: 'View',
          route: ['/simulations', this.id],
          display: NavItemDisplayLevel.always,
        });
        buttons.splice(1, 0, {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          route: ['/simulations', this.id, 'delete'],
          display: (simulation.access === AccessLevel.public ? NavItemDisplayLevel.never : NavItemDisplayLevel.user),
          displayUser: simulation.owner,
        });
        buttons.splice(3, 0, {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/simulations', 'new'],
          display: NavItemDisplayLevel.always,
        });
      } else {
        crumbs.push({
          label: 'New',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);

      if (modelId) {
        this.model = this.modelService.get(modelId);
        this.formGroup.patchValue({model: this.model});
      }

      if (this.id) {
        for (const el of simulation.tags) { this.addTagFormElement(); }
        for (const el of simulation.modelParameterChanges) { this.addModelParameterChangeFormElement(); }
        for (const el of simulation.algorithmParameterChanges) { this.addAlgorithmParameterChangeFormElement(); }
        for (const el of simulation.authors) { this.addAuthorFormElement(); }
        for (const el of simulation.refs) { this.addRefFormElement(); }
        this.model = simulation.model;
        this.algorithm = simulation.algorithm;
        this.formGroup.patchValue(simulation);
        for (const changeFormGroup of this.getFormArray('modelParameterChanges').controls) {
          const parameter = changeFormGroup.value.parameter
          changeFormGroup.patchValue({
            defaultValue: parameter.value,
            units: parameter.units,
          })
        }

      } else {
        for (let i = 0; i < 3; i++) {
          // this.addTagFormElement();
          // this.addModelParameterChangeFormElement();
          // this.addAlgorithmParameterChangeFormElement();
          this.addAuthorFormElement();
          this.addRefFormElement();
        }
      }
    });
  }

  getModelParameters(value: string): void {
    this.modelParameters = this.modelService.getParameters(this.model, value);
  }

  getAlgorithmParameters(value: string): void {
    this.algorithmParameters = this.metadataService.getAlgorithmParameters(
      this.algorithm, value);
  }

  getFormArray(array: string): FormArray {
    return this.formGroup.get(array) as FormArray;
  }

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
  }

  displayAutocompleteParameter(parameter: ModelParameter | AlgorithmParameter): string | undefined {
    return parameter ? parameter.id + ': ' + parameter.name : undefined;
  }

  selectAutocomplete(formControl: AbstractControl, required = false): void {
    const value = formControl.value;
    if (required && (typeof value === 'string' || value === null)) {
      formControl.setErrors({incorrect: true});
    } else if (!required && typeof value === 'string' && value !== '') {
      formControl.setErrors({incorrect: true});
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

    this.formGroup.patchValue({modelParameterChanges: []});

    const controls = this.getFormArray('modelParameterChanges').controls;
    controls.splice(0, controls.length);

    this.addModelParameterChangeFormElement();
    this.addModelParameterChangeFormElement();
    this.addModelParameterChangeFormElement();
  }

  selectAutocompleteModelParameter(formGroup: FormGroup): void {
    const parameterFormControl:FormControl = formGroup.get('parameter') as FormControl;
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
    this.formGroup.patchValue({algorithmParameterChanges: []});

    const controls = this.getFormArray('algorithmParameterChanges').controls;
    controls.splice(0, controls.length);

    this.addAlgorithmParameterChangeFormElement();
    this.addAlgorithmParameterChangeFormElement();
    this.addAlgorithmParameterChangeFormElement();
  }

  selectAutocompleteAlgorithmParameter(formGroup: FormGroup): void {
    const parameterFormControl:FormControl = formGroup.get('parameter') as FormControl;
    this.selectAutocomplete(parameterFormControl, true);

    const parameter = parameterFormControl.value;
    let defaultValue: number;
    if (parameter instanceof AlgorithmParameter) {
      defaultValue = parameter.value;
    }

    formGroup.patchValue({
      defaultValue,
      value: ''
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
    formArray.push(this.formBuilder.group({
      parameter: [''],
      defaultValue: [''],
      value: [''],
      units: [''],
    }));
  }

  addAlgorithmParameterChangeFormElement(): void {
    const formArray: FormArray = this.getFormArray('algorithmParameterChanges');
    formArray.push(this.formBuilder.group({
      parameter: [''],
      defaultValue: {value: null, disabled: true},
      value: [''],
    }));
  }

  addAuthorFormElement(): void {
    const formArray: FormArray = this.getFormArray('authors');
    formArray.push(this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
    }));
  }

  addRefFormElement(): void {
    const formArray: FormArray = this.getFormArray('refs');
    formArray.push(this.formBuilder.group({
      authors: [''],
      title: [''],
      journal: [''],
      volume: [''],
      num: [''],
      pages: [''],
      year: [''],
      doi: [''],
    }));
  }

  drop(array: string, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.getFormArray(array).controls,
      event.previousIndex,
      event.currentIndex);
  }

  submit() {
    const data: Simulation = this.formGroup.value as Simulation;
    const simulationId: string = this.simulationService.save(this.id, data);

    this.showAfterSubmitMessage = true;
    setTimeout(() => {
      this.router.navigate(['/simulations', simulationId]);
    }, 2500);
  }
}
