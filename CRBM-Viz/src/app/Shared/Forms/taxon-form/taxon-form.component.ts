import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { MetadataService } from '../../Services/metadata.service';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Taxon, TaxonSerialized } from '../../Models/taxon';
import {
  FormGroup,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { ObjectSubForm } from '../object-sub-form';

@Component({
  selector: 'app-taxon-form',
  templateUrl: './taxon-form.component.html',
  styleUrls: ['./taxon-form.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaxonFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TaxonFormComponent),
      multi: true,
    },
  ],
})
export class TaxonFormComponent extends ObjectSubForm implements OnInit {
  form: FormGroup;
  taxon: FormGroup;
  get nameControl() {
    return this.form.controls.name;
  }
  get idControl() {
    return this.form.controls.id;
  }
  get taxonControl() {
    return this.taxon.controls.taxon;
  }
  constructor(
    private metadataService: MetadataService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.form = this.formBuilder.group({
      name: [''],
      id: [''],
    });
    this.taxon = this.formBuilder.group({
      taxon: [{}],
    });

    this.subscriptions.push(
      this.taxonControl.valueChanges.subscribe(value => {
        if (value === null) {
          this.nameControl.enable();
          this.idControl.enable();
        } else {
          this.nameControl.setValue(null);
          this.idControl.setValue(null);
          this.nameControl.setValue(value?.name);
          this.idControl.setValue(value?.id);
          this.nameControl.disable();
          this.idControl.disable();
        }

        this.onChange(value);
        this.onTouched();
      })
    );
  }

  taxa: Observable<Taxon[]>;

  get value(): TaxonSerialized {
    return this.form.value;
  }

  set value(value: TaxonSerialized) {
    this.form.setValue(value);
    this.nameControl.setValue(value?.name);
    this.idControl.setValue(value?.id);
    this.onChange(value);
    this.onTouched();
  }

  disabled: boolean;
  subscriptions: Subscription[] = [];

  onChange: any = () => {};
  onTouched: any = () => {};
  taxonDisplay(taxon: TaxonSerialized) {
    return taxon?.name;
  }
  ngOnInit(): void {
    this.taxa = this.taxon.controls.taxon.valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => this.metadataService.getTaxa$(value)),
      switchMap(value => value)
    );
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
      this.taxonControl.setValue(obj);
    }
    if (obj == null) {
      this.taxon.reset();
      this.nameControl.reset();
      this.idControl.reset();
    }

    this.onChange();
    this.onTouched();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.taxon.disable();
  }
  validate(_: FormControl) {
    return this.form.valid ? null : { model: { valid: false } };
  }
}
