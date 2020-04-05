import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, pluck, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { accessLevels, AccessLevel } from '@biosimulations/datamodel/core';
import { licenses } from '../../Shared/Models/license';
import { ChartType } from '../../Shared/Models/chart-type';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { ChartTypeService } from '../../Shared/Services/Resources/chart-type.service';
import { NavItem } from '../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { OkCancelDialogComponent } from '../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {
  accessLevels = accessLevels;
  licenses = licenses;
  readonly chipSeparatorKeyCodes: number[] = [ENTER];

  id: string;
  chartType: ChartType;
  formGroup: FormGroup;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private chartTypeService: ChartTypeService,
  ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      spec: [''],
      image: [''],
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
        this.chartTypeService
          .read(this.id)
          .subscribe(chart => (this.chartType = chart));
      }

      // setup bread crumbs and buttons
      const crumbs: object[] = [
        { label: 'Chart types', route: ['/chart-types'] },
      ];
      if (this.id) {
        crumbs.push({
          label: 'Chart type ' + this.id,
          route: ['/chart-types', this.id],
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
          route: ['/chart-types', this.id],
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
            this.id &&
            this.chartType &&
            this.chartType.access === AccessLevel.public
              ? NavItemDisplayLevel.never
              : NavItemDisplayLevel.user,
          displayUser: !!this.chartType ? this.chartType.owner : null,
        },
        {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/chart-types', 'new'],
          display: this.id
            ? NavItemDisplayLevel.always
            : NavItemDisplayLevel.never,
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your chart types',
          route: ['/user', 'chart-types'],
          display: NavItemDisplayLevel.loggedIn,
        },
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/chart-types'],
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

        for (const tag of this.chartType.tags) {
          this.addTagFormElement();
        }
        for (const author of this.chartType.authors) {
          this.addAuthorFormElement();
        }
        for (const identifiers of this.chartType.identifiers) {
          this.addIdentifierFormElement();
        }
        for (const ref of this.chartType.refs) {
          this.addRefFormElement();
        }
        this.formGroup.patchValue(this.chartType);
        if (this.chartType.spec) {
          this.formGroup.patchValue({
            spec: JSON.stringify(this.chartType.spec, null, 2),
          });
        }
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

  displayAutocompleteEl(el: object): string | undefined {
    return el ? el['name'] : undefined;
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
    this.formGroup.value.spec = JSON.parse(this.formGroup.value.spec);
    const data: ChartType = this.formGroup.value as ChartType;
    const chart: Observable<ChartType> = this.chartTypeService.update(data);
    chart.pipe(
      pluck('id'),
      tap(id => {
        this.snackBar.open('Chart type saved', '', {
          panelClass: 'centered-snack-bar',
          duration: 3000,
        });

        setTimeout(() => {
          this.router.navigate(['/chart-types', id]);
        }, 2500);
      }),
    );
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete chart type ${this.id}?`,
        action: () => {
          this.chartTypeService.delete(this.id);
          this.router.navigate(['/chart-types']);
        },
      },
    });
  }
}
