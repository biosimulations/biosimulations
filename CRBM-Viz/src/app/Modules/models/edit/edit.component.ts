import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { License, licenses } from 'src/app/Shared/Enums/license';
import { Model } from 'src/app/Shared/Models/model';
import { ModelService } from 'src/app/Shared/Services/model.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  AccessLevel = AccessLevel;
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
    private modelService: ModelService
    ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      description: [''],
      taxon: this.formBuilder.group({
        id: [''],
        name: [''],
      }),
      tags: this.formBuilder.array([]),
      authors: this.formBuilder.array([]),
      identifiers: this.formBuilder.array([]),
      refs: this.formBuilder.array([]),
      access: [''],
      license: [''],
    });
  }

  ngOnInit() {
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
          display: (model.access === AccessLevel.public ? NavItemDisplayLevel.never : NavItemDisplayLevel.always),
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

  addTagFormElement() {
    const formArray: FormArray = this.formGroup.get('tags') as FormArray;
    formArray.push(this.formBuilder.control(''));
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    let value: string = event.value;

    // Add tag
    value = (value || '').trim();
    if (value && !this.formGroup.value.tags.includes(value)) {
      const formArray: FormArray = this.formGroup.get('tags') as FormArray;
      formArray.push(this.formBuilder.control(value));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeFormArrayElement(array: string, iEl: number): void {
    const formArray: FormArray = this.formGroup.get(array) as FormArray;
    formArray.removeAt(iEl);
  }

  addAuthorFormElement(): void {
    const formArray: FormArray = this.formGroup.get('authors') as FormArray;
    formArray.push(this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
    }));
  }

  addIdentifierFormElement(): void {
    const formArray: FormArray = this.formGroup.get('identifiers') as FormArray;
    formArray.push(this.formBuilder.group({
      namespace: [''],
      id: [''],
    }));
  }

  addRefFormElement(): void {
    const formArray: FormArray = this.formGroup.get('refs') as FormArray;
    formArray.push(this.formBuilder.group({
      authors: [''],
      journal: [''],
      volume: [''],
      num: [''],
      pages: [''],
      year: [''],
      doi: [''],
    }));
  }

  submit() {
    const modelId: string = this.modelService.save(this.id, this.formGroup.value as Model);

    this.showAfterSubmitMessage = true;
    setTimeout(() => {
      this.router.navigate(['/models', modelId]);
    }, 2500);
  }
}
