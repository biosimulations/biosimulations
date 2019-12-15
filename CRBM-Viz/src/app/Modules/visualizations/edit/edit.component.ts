import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AccessLevel, accessLevels } from 'src/app/Shared/Enums/access-level';
import { ChartTypeDataFieldShape } from 'src/app/Shared/Enums/chart-type-data-field-shape';
import { License, licenses } from 'src/app/Shared/Enums/license';
import { ChartType } from 'src/app/Shared/Models/chart-type';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { SimulationResult } from 'src/app/Shared/Models/simulation-result';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationDataField } from 'src/app/Shared/Models/visualization-data-field';
import { VisualizationLayoutElement } from 'src/app/Shared/Models/visualization-layout-element';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { VisualizationService } from 'src/app/Shared/Services/visualization.service';
import { OkCancelDialogComponent, OkCancelDialogData } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { ChartTypesGridComponent } from 'src/app/Shared/Components/chart-types-grid/chart-types-grid.component';
import { SimulationsGridComponent } from 'src/app/Shared/Components/simulations-grid/simulations-grid.component';

enum Mode {
  new = 'new',
  newOfSimulation = 'newOfSimulation',
  fork = 'fork',
  edit = 'edit',
}

// tslint:disable:max-line-length

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  simulations: Observable<Simulation[]>;
  accessLevels = accessLevels;
  licenses = licenses;
  readonly chipSeparatorKeyCodes: number[] = [ENTER];

  private mode: Mode;
  private url: UrlSegment[];
  private id: string;
  private simulationId: string;
  visualization: Visualization;
  formGroup: FormGroup;

  private _simulationsGrid: SimulationsGridComponent;
  private _chartTypesGrid: ChartTypesGridComponent;
  private simulationsGridReady = false;
  private chartTypesGridReady = false;

  @ViewChild('simulationsGrid', { static: false })
  set simulationsGrid(value:ElementRef) {
    this._simulationsGrid = (value as unknown) as SimulationsGridComponent;
    this.updateSimulationsGrid();
  }

  @ViewChild('chartTypesGrid', { static: false })
  set chartTypesGrid(value:ElementRef) {
    this._chartTypesGrid = (value as unknown) as ChartTypesGridComponent;
    this.updateChartTypesGrid();
  }

  selectedChartTypes = [];

  columns = 1;
  private _layout: ElementRef;

  @ViewChild('layout', { static: false })
  set layout(value:ElementRef) {
    this._layout = value;
    this.updateLayout();
  }

  allSimulationResults: object[] = [];
  filteredSimulationResults: object[] = [];
  private currSimulationResultsFormArray: FormArray;
  private currSimulationResultsInput;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: MetadataService,
    private modelService: ModelService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService,
    ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      layout: this.formBuilder.array([]),
      image: [''],
      description: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
      columns: [1, Validators.min(1)],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = this.route.snapshot.url;
      this.id = params.id;
      this.simulationId = params.simulationId;
      this.setUp();
    });
  }

  setUp(): void {
    // determine mode: new, new of a model, edit, fork
    if (this.simulationId) {
      // new visualization of a simulation
      this.mode = Mode.newOfSimulation;
    } else if (this.id) {
      if (this.url.length > 1 && this.url[1].path === 'fork') {
        this.mode = Mode.fork;
      } else {
        this.mode = Mode.edit;
      }
    } else {
      // new visualization
      this.mode = Mode.new;
    }

    // get data
    if (this.id) {
      this.visualization = this.visualizationService.get(this.id);
    }
    if (this.simulationId) {
    }

    // bread crumbs and buttons
    const crumbs: object[] = [
      {label: 'Visualizations', route: ['/visualizations']},
    ];
    switch (this.mode) {
      case Mode.new:
        crumbs.push({
          label: 'New',
        });
        break;
      case Mode.newOfSimulation:
        crumbs.push({
          label: 'Simulation ' + this.simulationId,
        });
        crumbs.push({
          label: 'New',
        });
        break;
      case Mode.fork:
        crumbs.push({
          label: 'Visualization ' + this.id,
          route: ['/visualizations', this.id],
        });
        crumbs.push({
          label: 'Fork',
        });
        break;
      case Mode.edit:
        crumbs.push({
          label: 'Visualization ' + this.id,
          route: ['/visualizations', this.id],
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
        display: (this.mode === Mode.edit ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
      },
      {
        iconType: 'fas',
        icon: 'bars',
        label: 'View',
        route: ['/visualizations', this.id],
        display: (this.mode === Mode.edit ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
      },
      {
        iconType: 'fas',
        icon: 'code-branch',
        label: 'Fork',
        route: ['/visualizations', this.id, 'fork'],
        display: (this.mode === Mode.edit ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
      },
      {
        iconType: 'fas',
        icon: 'trash-alt',
        label: 'Delete',
        click: () => { this.openDeleteDialog() },
        display: (
          this.mode === Mode.edit
          && this.visualization
          && this.visualization.access === AccessLevel.private
          ? NavItemDisplayLevel.user
          : NavItemDisplayLevel.never),
        displayUser: (!!this.visualization ? this.visualization.owner : null),
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/visualizations', 'new'],
        display: (this.mode === Mode.new ? NavItemDisplayLevel.never : NavItemDisplayLevel.always),
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your visualizations',
        route: ['/user', 'visualizations'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/visualizations'],
        display: NavItemDisplayLevel.always,
      },
    ];

    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);

    // populate form
    if (this.simulationId) {
    }

    if (this.id) {
      this.getFormArray('layout').clear();
      this.getFormArray('tags').clear();
      this.getFormArray('authors').clear();
      this.getFormArray('identifiers').clear();
      this.getFormArray('refs').clear();

      for (const el of this.visualization.layout) { this.addChartTypeToLayout(el.chartType, el.data); }
      for (const el of this.visualization.tags) { this.addTagFormElement(); }
      for (const el of this.visualization.authors) { this.addAuthorFormElement(); }
      for (const el of this.visualization.identifiers) { this.addIdentifierFormElement(); }
      for (const el of this.visualization.refs) { this.addRefFormElement(); }
      this.formGroup.patchValue(this.visualization);

      this.updateSimulationsGrid();
      this.updateChartTypesGrid();
    } else {
      for (let i = 0; i < 3; i++) {
        // this.addLayoutFormElement();
        // this.addTagFormElement();
        this.addAuthorFormElement();
        this.addIdentifierFormElement();
        this.addRefFormElement();
      }
    }

    // update layout
    this.updateLayout();
  }

  onSimulationsGridReady(event): void {
    this.simulationsGridReady = true;
    this.updateSimulationsGrid();
  }

  onChartTypesGridReady(event): void {
    this.chartTypesGridReady = true;
    this.updateChartTypesGrid();
  }

  updateSimulationsGrid(): void {
    if (this._simulationsGrid && this.simulationsGridReady && this.visualization) {
      this.allSimulationResults = [];
      this._simulationsGrid.unselectAllRows();
      for (const layoutEl of this.visualization.layout) {
        for (const data of layoutEl.data) {
          for (const simResult of data.simulationResults) {
            this._simulationsGrid.setRowSelection(simResult.simulation, true);
            this.selectSimulation(simResult.simulation, true);
          }
        }
      }
    }
  }

  updateChartTypesGrid(): void {
    if (this._chartTypesGrid && this.chartTypesGridReady && this.visualization) {
      this.selectedChartTypes = [];
      this._chartTypesGrid.unselectAllRows();
      for (const layoutEl of this.visualization.layout) {
        this._chartTypesGrid.setRowSelection(layoutEl.chartType, true);
        this.selectChartType(layoutEl.chartType, true);
      }
    }
  }

  selectChartType(chartType: ChartType, selected: boolean): void {
    const formArray: FormArray = this.getFormArray('layout');
    if (selected) {
      this.selectedChartTypes.push(chartType);
      this.selectedChartTypes = this.selectedChartTypes.sort((a, b) =>
        (a.id > b.id ? 1 : -1));
    } else {
      for (let iChartType = 0; iChartType < this.selectedChartTypes.length; iChartType++) {
        if (this.selectedChartTypes[iChartType].id === chartType.id) {
          this.selectedChartTypes.slice(iChartType, 1);
        }
      }

      for (let iChartType = 0; iChartType < formArray.controls.length; iChartType++) {
        if (formArray.controls[iChartType].value.chartType.id === chartType.id) {
          formArray.removeAt(iChartType);
        }
      }
    }

    this.updateLayout();
  }

  addChartTypeToLayout(chartType: ChartType, vizDataFields: VisualizationDataField[] = []): void {
    const formArray: FormArray = this.getFormArray('layout');
    const formGroup: FormGroup = this.genLayoutFormGroup(chartType);
    formArray.push(formGroup);

    const dataFormArray: FormArray = formGroup.get('data') as FormArray;
    for (let iVizDataField=0; iVizDataField < vizDataFields.length; iVizDataField++) {
      const vizDataField: VisualizationDataField = vizDataFields[iVizDataField];
      const simResultsFormArray: FormArray = dataFormArray.controls[iVizDataField].get('simulationResults') as FormArray;
      for (const simResult of vizDataField.simulationResults) {
        simResultsFormArray.push(this.formBuilder.control(simResult));
      }
    }
  }

  genLayoutFormGroup(chartType: ChartType): FormGroup {
    const dataFormArray: FormArray = this.formBuilder.array([]);
    for (const dataField of chartType.getDataFields()) {
      const simResultsFormArray: FormArray = this.formBuilder.array([],
        (dataField.shape === ChartTypeDataFieldShape.array
          ? [Validators.required, Validators.minLength(1)]
          : Validators.maxLength(1)));
      dataFormArray.push(this.formBuilder.group({
        dataField: this.formBuilder.control(dataField),
        simulationResults: simResultsFormArray,
      }));
    }
    const formGroup: FormGroup = this.formBuilder.group({
      chartType: this.formBuilder.control(chartType),
      data: dataFormArray,
    });
    return formGroup;
  }

  changeColumns(event): void {
    if (event.target.valueAsNumber < 1) {
      this.formGroup.patchValue({columns: 1});
    }
    this.updateLayout();
  }

  updateLayout(): void {
    this.columns = this.formGroup.value.columns;
    const rows = Math.max(1, Math.ceil(this.getFormArray('layout').length / this.columns));

    if (this._layout) {
      this._layout.nativeElement.setAttribute('style', (
        `grid-template-rows: repeat(${ rows }, 10rem);` +
        `grid-template-columns: repeat(${ this.columns }, 10rem)`));
    }
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

  selectSimulation(simulation: Simulation, selected: boolean): void {
    if (selected) {
      const simulationResults: SimulationResult[] = [];
      for (const variable of this.modelService.getVariables(simulation.model)) {
        const simulationResult = new SimulationResult();
        simulationResult.simulation = simulation;
        simulationResult.variable = variable;
        simulationResults.push(simulationResult);
      }

      this.allSimulationResults.push({
        simulation,
        simulationResults,
      });
      this.allSimulationResults = this.allSimulationResults.sort((a, b) => {
        return a['simulation'].id > b['simulation'].id ? 1 : -1;
      });
    } else {
      for (let iGroup = 0; iGroup < this.allSimulationResults.length; iGroup++) {
        if (this.allSimulationResults[iGroup]['simulation'].id === simulation.id) {
          this.allSimulationResults.splice(iGroup, 1);
        }
      }
    }
  }

  filterSimulationResults(value: string, formArray: FormArray, input) {
    // filter simulation results
    value = value.toLowerCase();

    const filteredSimulationResults = [];
    for (const group of this.allSimulationResults) {
      if (group['simulation'].id.toLowerCase().includes(value) || group['simulation'].name.toLowerCase().includes(value)) {
        filteredSimulationResults.push(group);
      } else {
        const filteredGroup = {simulation: group['simulation'], simulationResults: []};
        for (const simulationResult of group['simulationResults']) {
          if (simulationResult.variable.id.toLowerCase().includes(value) || simulationResult.variable.name.toLowerCase().includes(value)) {
            filteredGroup['simulationResults'].push(simulationResult);
          }
        }
        if (filteredGroup['simulationResults'].length) {
          filteredSimulationResults.push(filteredGroup);
        }
      }
    }

    this.filteredSimulationResults = filteredSimulationResults;

    // store current simulation results form, input
    this.currSimulationResultsFormArray = formArray;
    this.currSimulationResultsInput = input;
  }

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
  }

  simulationResultsDisplayAutocompleteEl(el: SimulationResult): string | undefined {
    return el ? el.simulation.name + ': ' + el.variable.id : undefined;
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

  addSimulationResult(event: MatAutocompleteSelectedEvent) {
    let inArray = false;
    for (const simulationResult of this.currSimulationResultsFormArray.value) {
      if (simulationResult.simulation.id === event.option.value.simulation.id &&
        simulationResult.variable.id === event.option.value.variable.id) {
        inArray = true;
        break;
      }
    }

    if (!inArray) {
      this.currSimulationResultsFormArray.push(this.formBuilder.control(event.option.value));
    }
    this.currSimulationResultsInput.value = '';
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

  removeFormArrayElement(formArray, iEl: number): void {
    (formArray as FormArray).removeAt(iEl);
  }

  addAuthorFormElement(): void {
    const formArray: FormArray = this.getFormArray('authors');
    formArray.push(this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
    }));
  }

  addIdentifierFormElement(): void {
    const formArray: FormArray = this.getFormArray('identifiers');
    formArray.push(this.formBuilder.group({
      namespace: [''],
      id: [''],
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

  drop(formArray: FormArray, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      formArray.controls,
      event.previousIndex,
      event.currentIndex);
  }

  submit() {
    const data: Visualization = this.formGroup.value as Visualization;
    if (this.mode === Mode.fork) {
      data.parent = this.visualization;
    }
    const visualizationId: string = this.visualizationService.set(
      data, this.mode === Mode.edit ? this.id : null);

    this.snackBar.open('Visualization saved', '', {
      panelClass: 'centered-snack-bar',
      duration: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/visualizations', visualizationId]);
    }, 2500);
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete visualization ${ this.id }?`,
        action: () => {
          this.visualizationService.delete(this.id);
          this.router.navigate(['/visualizations']);
        },
      },
    });
  }
}
