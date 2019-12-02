import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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
import { Model } from 'src/app/Shared/Models/model';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { MetadataService } from 'src/app/Shared/Services/metadata.service';
import { ModelService } from 'src/app/Shared/Services/model.service';

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
  formGroup: FormGroup;
  showAfterSubmitMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private router: Router,
    private metadataService: MetadataService,
    private modelService: ModelService
    ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      file: [null, Validators.required],
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
        map(taxonName => this.metadataService.getTaxa(taxonName))
      );

    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;

      const crumbs: object[] = [
        {label: 'Models', route: ['/models']},
      ];
      const buttons: NavItem[] = [
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/models'],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your models',
          route: ['/user', 'models'],
          display: NavItemDisplayLevel.loggedIn,
        },
      ];

      let model: Model;
      if (this.id) {
        model = this.modelService.get(this.id);

        crumbs.push({
          label: 'Model ' + this.id,
          route: ['/models', this.id],
        });
        crumbs.push({
          label: 'Edit',
        });

        buttons.splice(0, 0, {
          iconType: 'fas',
          icon: 'bars',
          label: 'View',
          route: ['/models', this.id],
          display: NavItemDisplayLevel.always,
        });
        buttons.splice(1, 0, {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          route: ['/models', this.id, 'delete'],
          display: (model.access === AccessLevel.public ? NavItemDisplayLevel.never : NavItemDisplayLevel.user),
          displayUser: model.owner,
        });
        buttons.splice(3, 0, {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/models', 'new'],
          display: NavItemDisplayLevel.always,
        });
      } else {
        crumbs.push({
          label: 'New',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);

      if (this.id) {
        for (const tag of model.tags) { this.addTagFormElement(); }
        for (const author of model.authors) { this.addAuthorFormElement(); }
        for (const identifiers of model.identifiers) { this.addIdentifierFormElement(); }
        for (const ref of model.refs) { this.addRefFormElement(); }
        this.formGroup.patchValue(model);
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

  displayTaxon(taxon: Taxon): string | undefined {
    return taxon ? taxon.name : undefined;
  }

  validateAutocomplete(formControl: FormControl, required = false): void {
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
    const data: Model = this.formGroup.value as Model;
    const modelId: string = this.modelService.save(this.id, data);

    this.showAfterSubmitMessage = true;
    setTimeout(() => {
      this.router.navigate(['/models', modelId]);
    }, 2500);
  }
}
