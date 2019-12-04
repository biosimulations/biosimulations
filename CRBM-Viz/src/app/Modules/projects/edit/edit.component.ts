import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AccessLevel, accessLevels } from 'src/app/Shared/Enums/access-level';
import { License, licenses } from 'src/app/Shared/Enums/license';
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
      description: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
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
        for (const tag of this.project.tags) { this.addTagFormElement(); }
        for (const author of this.project.authors) { this.addAuthorFormElement(); }
        for (const identifiers of this.project.identifiers) { this.addIdentifierFormElement(); }
        for (const ref of this.project.refs) { this.addRefFormElement(); }
        this.formGroup.patchValue(this.project);
      } else {
        for (let i = 0; i < 3; i++) {
          // this.addTagFormElement();
          this.addAuthorFormElement();
          this.addIdentifierFormElement();
          this.addRefFormElement();
        }
      }
    });
  }

  getFormArray(array: string): FormArray {
    return this.formGroup.get(array) as FormArray;
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

  drop(array: string, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.getFormArray(array).controls,
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
