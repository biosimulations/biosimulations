import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { Simulation } from 'src/app/Shared/Models/simulation';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { VisualizationService } from 'src/app/Shared/Services/visualization.service';
import { OkCancelDialogComponent, OkCancelDialogData } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

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
  private id: number;
  private simulationId: string;
  private visualization: Visualization;
  formGroup: FormGroup;

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
      image: [''],
      description: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
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
        icon: 'chart-area',
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
      for (const el of this.visualization.tags) { this.addTagFormElement(); }
      for (const el of this.visualization.authors) { this.addAuthorFormElement(); }
      for (const el of this.visualization.refs) { this.addRefFormElement(); }
      this.formGroup.patchValue(this.visualization);
    } else {
      for (let i = 0; i < 3; i++) {
        // this.addTagFormElement();
        this.addAuthorFormElement();
        this.addRefFormElement();
      }
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

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
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
    const data: Visualization = this.formGroup.value as Visualization;
    if (this.mode === Mode.fork) {
      data.parent = this.visualization;
    }
    const visualizationId: number = this.visualizationService.set(
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
