import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { map, startWith, pluck, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { NavItem } from '../../Shared/Enums/nav-item';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { AccessLevel, accessLevels } from '@biosimulations/datamodel/core';
import { License, licenses } from '../../Shared/Models/license';
import { Model } from '../../Shared/Models/model';
import { Taxon } from '../../Shared/Models/taxon';
import { MetadataService } from '../../Shared/Services/metadata.service';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from '../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { UserService } from '../../Shared/Services/user.service';
import { ModelSerializer } from '../../Shared/Serializers/model-serializer';
import { ModelService } from '../../Shared/Services/Resources/model.service';
import { RemoteFile } from '../../Shared/Models/remote-file';
import { FileService } from '../../Shared/Services/Resources/file.service';

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
    private modelService: ModelService,
    private userService: UserService,
    private fileService: FileService,
  ) {}

  ngOnInit() {
    this.taxa = this.formGroup.get('taxon').valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name,
      ),
      map(value => this.metadataService.getTaxa(value)),
    );
    this.formGroup = this.formBuilder.group({
      name: [''],
      identifier: [''],
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

    this.route.params.subscribe(params => {
      this.id = params.id;

      if (this.id) {
        this.modelService.read(this.id).subscribe(model => {
          this.model = model;
          this.model.userservice = this.userService;
          this.setUpBreadCrumbs();
          this.setupForm();
        });
      }
    });
  }
  private setupForm() {
    if (this.id) {
      this.getFormArray('tags').clear();
      this.getFormArray('authors').clear();
      this.getFormArray('identifiers').clear();
      this.getFormArray('refs').clear();
      this.formGroup.get('file').validator = null;
      for (const tag of this.model.tags) {
        this.addTagFormElement();
      }
      for (const author of this.model.authors) {
        this.addAuthorFormElement();
      }
      for (const identifiers of this.model.identifiers) {
        this.addIdentifierFormElement();
      }
      for (const ref of this.model.refs) {
        this.addRefFormElement();
      }
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
  }

  setUpBreadCrumbs() {
    // setup bread crumbs and buttons
    const crumbs: object[] = [{ label: 'Models', route: ['/models'] }];
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
        display: this.id
          ? NavItemDisplayLevel.always
          : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'bars',
        label: 'View',
        route: ['/models', this.id],
        display: this.id
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
          this.id && this.model && this.model.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: !!this.model ? this.model.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/models', 'new'],
        display: this.id
          ? NavItemDisplayLevel.always
          : NavItemDisplayLevel.never,
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
    formArray.push(
      this.formBuilder.group({
        firstName: [''],
        middleName: [''],
        lastName: [''],
      }),
    );
  }

  addIdentifierFormElement(): void {
    const formArray: FormArray = this.getFormArray('identifiers');
    formArray.push(
      this.formBuilder.group({
        namespace: [''],
        id: [''],
      }),
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
      }),
    );
  }

  drop(formArray: FormArray, event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      formArray.controls,
      event.previousIndex,
      event.currentIndex,
    );
  }

  submit() {
    const data = this.formGroup.value;

    let imageFileId: Observable<string>;
    // if the image is a RemoteFile, meaning it was already uploaded
    if (data.image.id) {
      imageFileId = of(data.image.id);
    }
    // If the image is a File, meaning it is newly added
    else {
      imageFileId = this.makeRemoteFileFromFile(data.image);
    }

    let modelFileId: Observable<string>;
    // if the image is a RemoteFile, meaning it was already uploaded
    if (data.file.id) {
      modelFileId = of(data.file.id);
    }
    // If the image is a File, meaning it is newly added
    else {
      modelFileId = this.makeRemoteFileFromFile(data.file);
    }
    const fileIds = forkJoin([imageFileId, modelFileId]);
    fileIds.subscribe(([imageId, modelId]) => {
      data.image = imageId;
      data.file = modelId;
      this.model = Object.assign(this.model, data);
      console.log(this.model);
      const modelSerializer = new ModelSerializer();
      const models = modelSerializer.toJson(this.model);
      console.log(models);
    });

    // this.modelService.update(models).subscribe();
  }

  private makeRemoteFileFromFile(file: File): Observable<string> {
    return this.fileService.create(
      file as File,
      file.name,
      file.type,
      this.model.access === AccessLevel.private,
      this.model.ownerId,
    );
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete model ${this.id}?`,
        action: () => {
          this.modelService.delete(this.id);
          this.router.navigate(['/models']);
        },
      },
    });
  }
}
