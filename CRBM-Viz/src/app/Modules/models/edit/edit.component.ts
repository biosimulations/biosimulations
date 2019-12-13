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
import { Model } from 'src/app/Shared/Models/model';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { OkCancelDialogComponent, OkCancelDialogData } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  taxa: Observable<Taxon[]>;
  accessLevels = accessLevels;
  licenses = licenses;
  readonly chipSeparatorKeyCodes: number[] = [ENTER];

  id: string;
  model: Model;
  formGroup: FormGroup;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: MetadataService,
    private modelService: ModelService
    ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      file: [''],
      image: [''],
      description: [''],
      taxon: [''],
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
    });
  }

  ngOnInit() {
    this.taxa = this.formGroup.get('taxon').valueChanges
      .pipe(
        startWith(''),
        map(value => value === null || typeof value === 'string' ? value : value.name),
        map(value => this.metadataService.getTaxa(value))
      );

    this.route.params.subscribe(params => {
      this.id = params.id;

      if (this.id) {
        this.model = this.modelService.get(this.id);
      }

      // setup bread crumbs and buttons
      const crumbs: object[] = [
        {label: 'Models', route: ['/models']},
      ];
      if (this.id) {
        crumbs.push({
          label: 'Model ' + this.id,
          route: ['/models', this.id],
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
          iconType: 'mat',
          icon: 'timeline',
          label: 'Simulate',
          route: ['/simulations', 'new', this.id],
          display: (this.id ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
        },
        {
          iconType: 'fas',
          icon: 'bars',
          label: 'View',
          route: ['/models', this.id],
          display: (this.id ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          click: () => { this.openDeleteDialog() },
          display: (
            this.id
            && this.model
            && this.model.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user),
          displayUser: (!!this.model ? this.model.owner : null),
        },
        {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/models', 'new'],
          display: (this.id ? NavItemDisplayLevel.always : NavItemDisplayLevel.never),
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your models',
          route: ['/user', 'models'],
          display: NavItemDisplayLevel.loggedIn,
        },
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/models'],
          display: NavItemDisplayLevel.always,
        },
      ];

      this.breadCrumbsService.set(crumbs, buttons);

      // setup form
      if (this.id) {
        this.formGroup.get('file').validator = null;
        for (const tag of this.model.tags) { this.addTagFormElement(); }
        for (const author of this.model.authors) { this.addAuthorFormElement(); }
        for (const identifiers of this.model.identifiers) { this.addIdentifierFormElement(); }
        for (const ref of this.model.refs) { this.addRefFormElement(); }
        this.formGroup.patchValue(this.model);
      } else {
        this.formGroup.get('file').validator = Validators.required;
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
    const data: Model = this.formGroup.value as Model;
    const modelId: string = this.modelService.set(data, this.id);

    this.snackBar.open('Model saved', '', {
      panelClass: 'centered-snack-bar',
      duration: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/models', modelId]);
    }, 2500);
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete model ${ this.id }?`,
        action: () => {
          this.modelService.delete(this.id);
          this.router.navigate(['/models']);
        },
      },
    });
  }
}
