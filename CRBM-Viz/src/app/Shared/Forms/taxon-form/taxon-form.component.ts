import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetadataService } from '../../Services/metadata.service';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Taxon, TaxonSerialized } from '../../Models/taxon';
import {
  FormGroup,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-taxon-form',
  templateUrl: './taxon-form.component.html',
  styleUrls: ['./taxon-form.component.sass'],
})
export class TaxonFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  constructor(private metadataService: MetadataService) {
    this.subscriptions.push(
      this.taxon.valueChanges.subscribe(value => {
        if (value === null) {
          this.name.enable();
          this.id.enable();
        } else {
          this.name.setValue(null);
          this.id.setValue(null);
          this.name.setValue(value?.name);
          this.id.setValue(value?.id);
          this.name.disable();
          this.id.disable();
        }

        this.onChange(value);
        this.onTouched();
      })
    );
  }
  name = new FormControl();
  id = new FormControl();
  test = new FormGroup({
    name: this.name,
    id: this.id,
  });
  taxon = new FormControl();
  taxa: Observable<Taxon[]>;

  get value(): TaxonSerialized {
    return this.taxon.value;
  }

  set value(value: TaxonSerialized) {
    this.taxon.setValue(value);
    this.name.setValue(value?.name);
    this.id.setValue(value?.id);
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
    this.taxa = this.taxon.valueChanges.pipe(
      startWith(''),
      map(value =>
        value === null || typeof value === 'string' ? value : value.name
      ),
      map(value => this.metadataService.getTaxa$(value)),
      switchMap(value => value)
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
    if (obj == null) {
      this.taxon.reset();
      this.name.reset();
      this.id.reset();
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
}
