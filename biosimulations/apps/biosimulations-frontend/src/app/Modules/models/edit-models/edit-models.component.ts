import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelService } from '../../../Shared/Services/Resources/model.service';
import { pluck, map, switchMap, tap, startWith } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { BreadCrumbsService } from '../../../Shared/Services/bread-crumbs.service';
import { OkCancelDialogComponent } from '../../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModelSerializer } from '../../../Shared/Serializers/model-serializer';

import { AccessLevel, accessLevels } from '@biosimulations/datamodel/core';
import { FileService } from '../../../Shared/Services/Resources/file.service';
import { Taxon } from '../../../Shared/Models/taxon';
import { licenses } from '../../../Shared/Models/license';
import { ENTER } from '@angular/cdk/keycodes';
import { MetadataService } from '../../../Shared/Services/metadata.service';

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
  metaInfo: FormControl;
  modelControl: FormControl;
  constructor(
    private router: Router,
    private modelService: ModelService,
    private route: ActivatedRoute,
    private breadcrumbs: BreadCrumbsService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private metadataService: MetadataService,
  ) {}

  ngOnInit(): void {
    this.data = {};
    this.modelControl = new FormControl([{}]);
    this.modelControl.valueChanges.subscribe(val => {
      console.log('valuechagned');
      this.data = Object.assign(this.data, val);
    });

    this.route.params
      .pipe(
        pluck('id'),
        tap(id => (this.id = id)),
        switchMap(id => this.modelService.read(id)),
        tap(model => (this.model = model)),
        tap(model =>
          this.breadcrumbs.setEditModel(model, this.openDeleteDialog),
        ),
      )
      .subscribe(model => this.setupForm(model));
  }
  private setupForm(model) {}

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
      this.model.ownerId,
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
