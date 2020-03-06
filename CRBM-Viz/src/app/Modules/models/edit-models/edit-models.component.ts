import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelService } from 'src/app/Shared/Services/Resources/model.service';
import { pluck, map, switchMap, tap, startWith } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { OkCancelDialogComponent } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModelSerializer } from 'src/app/Shared/Serializers/model-serializer';
import { AccessLevel, accessLevels } from 'src/app/Shared/Enums/access-level';
import { FileService } from 'src/app/Shared/Services/Resources/file.service';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { licenses } from 'src/app/Shared/Enums/license';
import { ENTER } from '@angular/cdk/keycodes';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelFormatFormComponent } from 'src/app/Shared/Forms/model-format-form/model-format-form.component';
@Component({
  selector: 'app-edit-models',
  templateUrl: './edit-models.component.html',
  styleUrls: ['./edit-models.component.sass'],
})
export class EditModelsComponent implements OnInit {
  formGroup: FormGroup;
  taxa: Observable<Taxon[]>;
  accessLevels = accessLevels;
  licenses = licenses;
  readonly chipSeparatorKeyCodes: number[] = [ENTER];
  data: any;
  model: any;
  id: any;
  fileFormGroup: FormGroup;
  constructor(
    private router: Router,
    private modelService: ModelService,
    private route: ActivatedRoute,
    private breadcrumbs: BreadCrumbsService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private metadataService: MetadataService
  ) {
    this.fileFormGroup = this.formBuilder.group({
      modelFile: [''],
      imageFile: [''],
    });
    this.formGroup = this.formBuilder.group({
      id: [''],
      ownerId: [''],
      format: [],
      file: [''],
      image: [''],
      name: [''],
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

  ngOnInit(): void {
    this.taxa = this.formGroup.get('taxon').valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => this.metadataService.getTaxa(value))
    );
    this.formGroup.valueChanges.subscribe(val => (this.data = val));
    this.route.params
      .pipe(
        pluck('id'),
        tap(id => (this.id = id)),
        switchMap(id => this.modelService.read(id)),
        tap(model => (this.model = model)),
        tap(model =>
          this.breadcrumbs.setEditModel(model, this.openDeleteDialog)
        )
      )
      .subscribe(model => this.setupForm(model));
  }
  private setupForm(model) {
    if (model?.id) {
      this.getFormArray('tags').clear();
      this.getFormArray('authors').clear();
      this.getFormArray('identifiers').clear();
      this.getFormArray('refs').clear();

      for (const tag of model.tags) {
        this.addTagFormElement();
      }
      for (const author of model.authors) {
        this.addAuthorFormElement();
      }
      for (const identifiers of model.identifiers) {
        this.addIdentifierFormElement();
      }
      for (const ref of model.refs) {
        this.addRefFormElement();
      }
      console.log(model);
      // this.formGroup.get('modelFile').patchValue(model.file.name);

      this.formGroup.patchValue(model);
    } else {
      this.formGroup.get('modelFile').validator = Validators.required;
      for (let i = 0; i < 3; i++) {
        this.addAuthorFormElement();
        this.addIdentifierFormElement();
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
      const modelSerializer = new ModelSerializer();
      const currentModel = modelSerializer.toJson(this.model);
      const newModel = Object.assign(currentModel, data);
      console.log(this.model);
      console.log(currentModel);
      console.log(newModel);
      this.model = modelSerializer.fromJson(newModel);
      console.log(this.model);
      this.modelService.update(this.model).subscribe();
    });

    //
  }

  private makeRemoteFileFromFile(file: File): Observable<string> {
    return this.fileService.create(
      file as File,
      file?.name,
      file?.type,
      this.model.access === AccessLevel.private,
      this.model.ownerId
    );
  }
  private openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete model ${this.model.id}?`,
        action: () => {
          this.modelService.delete(this.model.id);
          this.router.navigate(['/models']);
        },
      },
    });
  }
}
