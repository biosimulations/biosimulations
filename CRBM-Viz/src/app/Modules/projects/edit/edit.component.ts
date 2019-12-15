import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AccessLevel, accessLevels } from 'src/app/Shared/Enums/access-level';
import { License, licenses } from 'src/app/Shared/Enums/license';
import { ProjectProductType, projectProductTypes } from 'src/app/Shared/Enums/project-product-type';
import { JournalReference } from 'src/app/Shared/Models/journal-reference';
import { Project } from 'src/app/Shared/Models/project';
import { Model } from 'src/app/Shared/Models/model';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { VisualizationService } from 'src/app/Shared/Services/visualization.service';
import { OkCancelDialogComponent, OkCancelDialogData } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  accessLevels = accessLevels;
  licenses = licenses;
  productTypes: object[];
  refs: JournalReference[];
  models: Model[];
  simulations: Simulation[];
  visualizations: Visualization[];
  readonly chipSeparatorKeyCodes: number[] = [ENTER];

  id: string;
  project: Project;
  formGroup: FormGroup;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modelService: ModelService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService
    ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      image: [''],
      description: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      products: this.formBuilder.array([]),
      access: [''],
      license: [''],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;

      if (this.id) {
        this.project = this.projectService.get(this.id);
      }

      // setup bread crumbs and buttons
      const crumbs: object[] = [
        {label: 'Projects', route: ['/projects']},
      ];
      if (this.id) {
        crumbs.push({
          label: 'Project ' + this.id,
          route: ['/projects', this.id],
        });
        crumbs.push({
          label: 'Edit',
        });
      } else {
        crumbs.push({
          label: 'New',
        });
      }

      const buttons: NavItem[] = [
        {
          iconType: 'fas',
          icon: 'bars',
          label: 'View',
          route: ['/projects', this.id],
          display: (this.id ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          click: () => { this.openDeleteDialog() },
          display: (
            this.id
            && this.project
            && this.project.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user),
          displayUser: (!!this.project ? this.project.owner : null),
        },
        {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/projects', 'new'],
          display: (this.id ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your projects',
          route: ['/user', 'projects'],
          display: NavItemDisplayLevel.loggedIn,
        },
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/projects'],
          display: NavItemDisplayLevel.always,
        },
      ];

      this.breadCrumbsService.set(crumbs, buttons);

      // setup form
      if (this.id) {
        this.getFormArray('tags').clear();
        this.getFormArray('authors').clear();
        this.getFormArray('identifiers').clear();
        this.getFormArray('refs').clear();
        this.getFormArray('products').clear();

        for (const tag of this.project.tags) { this.addTagFormElement(); }
        for (const author of this.project.authors) { this.addAuthorFormElement(); }
        for (const identifiers of this.project.identifiers) { this.addIdentifierFormElement(); }
        for (const ref of this.project.refs) { this.addRefFormElement(); }
        for (const product of this.project.products) {
          const productFormGroup: FormGroup = this.addProductFormElement();
          for (const resource of product.resources) {
            this.addProductResourceElement(productFormGroup);
          }
        }
        this.formGroup.patchValue(this.project);
      } else {
        for (let i = 0; i < 3; i++) {
          // this.addTagFormElement();
          this.addAuthorFormElement();
          this.addIdentifierFormElement();
          this.addRefFormElement();
          this.addProductFormElement();
        }
      }
    });
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

  getRefs(value: string): void {
    const allRefs: JournalReference[] = this.formGroup.value.refs.map(data => {
      const ref = new JournalReference();
      return Object.assign(ref, data);
    });

    if (value) {
      const lowCaseValue: string = value.toLowerCase();
      this.refs = allRefs.filter(ref =>
        ((ref.authors && ref.authors.toLowerCase().includes(lowCaseValue))
        || (ref.title && ref.title.toLowerCase().includes(lowCaseValue))
        || (ref.journal && ref.journal.toLowerCase().includes(lowCaseValue))
        || (ref.doi && ref.doi.toLowerCase().includes(lowCaseValue)))
      );
    } else {
      this.refs = allRefs.slice();
    }
  }

  getProductTypes(value: string): void {
    if (value) {
      const lowCaseValue: string = value.toLowerCase();
      this.productTypes = projectProductTypes.filter(el =>
        el['name'].toLowerCase().includes(lowCaseValue)
      );
    } else {
      this.productTypes = projectProductTypes;
    }
  }

  getProductResources(value: string): void {
    this.models = this.modelService.list(value);
    this.simulations = this.simulationService.list(value);
    this.visualizations = this.visualizationService.list(value);
  }

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
  }

  productRefDisplayAutocompleteEl(ref: JournalReference): string | undefined {
    return ref ? ref.getShortName() : undefined;
  }

  productTypeDisplayAutocompleteEl(el: any): string | undefined {
    return (
      el in ProjectProductType
      ? ProjectProductType[el][0].toUpperCase() + ProjectProductType[el].substring(1)
      : undefined);
  }

  productResourceDisplayAutocompleteEl(el: object): string | undefined {
    return el ? el['id'] + ': ' + el['name'] : undefined;
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

  clearProductResourceInput(event: MatChipInputEvent): void {
    const input = event.input;
    input.value = '';
  }

  addProductResource(formGroup: FormGroup, event: MatAutocompleteSelectedEvent, input) {
    const formArray: FormArray = formGroup.get('resources') as FormArray;
    if (!formGroup.value.resources.map(res => res.id).includes(event.option.value.id)) {
      formArray.push(this.formBuilder.control(event.option.value));
    }
    input.value = '';
  }

  removeFormArrayElement(array: string, iEl: number): void {
    const formArray: FormArray = this.getFormArray(array);
    formArray.removeAt(iEl);
  }

  removeProductResource(formGroup: FormGroup, iResource: number): void {
    (formGroup.get('resources') as FormArray).removeAt(iResource);
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

  addProductFormElement(): FormGroup {
    const formArray: FormArray = this.getFormArray('products');
    const formGroup: FormGroup = this.formBuilder.group({
      ref: [''],
      type: [''],
      label: [''],
      description: [''],
      resources: this.formBuilder.array([]),
    });
    formArray.push(formGroup);
    return formGroup;
  }

  addProductResourceElement(formGroup: FormGroup): void {
    const formArray: FormArray = formGroup.get('resources') as FormArray;
    formArray.push(this.formBuilder.control(''));
  }

  drop(formArray: FormArray, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      formArray.controls,
      event.previousIndex,
      event.currentIndex);
  }

  submit() {
    const data: Project = this.formGroup.value as Project;
    const projectId: string = this.projectService.set(data, this.id);

    this.snackBar.open('Project saved', '', {
      panelClass: 'centered-snack-bar',
      duration: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/projects', projectId]);
    }, 2500);
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete project ${ this.id }?`,
        action: () => {
          this.projectService.delete(this.id);
          this.router.navigate(['/projects']);
        },
      },
    });
  }
}
