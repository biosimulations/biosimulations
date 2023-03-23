import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
  HostBinding,
  Renderer2,
  HostListener,
  Optional,
  Self,
  DoCheck,
} from '@angular/core';
import { ControlValueAccessor, NgControl, NgForm, FormGroupDirective } from '@angular/forms';

import { FileInput } from '../model/file-input.model';
import { FileInputMixinBase } from './file-input-mixin';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';

@Component({
  selector: 'biosimulations-ngx-mat-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: FileInputComponent }],
})
export class FileInputComponent
  extends FileInputMixinBase
  implements MatFormFieldControl<FileInput>, ControlValueAccessor, OnInit, OnDestroy, DoCheck
{
  private static nextId = 0;

  public focused = false;
  public controlType = 'file-input';

  @Input() public autofilled = false;

  private _placeholder!: string;
  private _required = false;
  private _multiple!: boolean;

  @Input() public valuePlaceholder!: string;
  @Input() public accept: string | null = null;
  @Input() public override errorStateMatcher!: ErrorStateMatcher;

  @HostBinding() public id = `biosimulations-ngx-mat-file-input-${FileInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') public describedBy = '';

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  @Input()
  public get value(): FileInput | null {
    return this.empty ? null : new FileInput(this._elementRef.nativeElement.value || []);
  }
  public set value(fileInput: FileInput | null) {
    if (fileInput) {
      this.writeValue(fileInput);
      this.stateChanges.next();
    }
  }

  @Input()
  public get multiple(): boolean {
    return this._multiple;
  }
  public set multiple(value: boolean | string) {
    this._multiple = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  /**
   * Whether the current input has files
   */
  public get empty(): boolean {
    return !this._elementRef.nativeElement.value || this._elementRef.nativeElement.value.length === 0;
  }

  @HostBinding('class.mat-form-field-should-float')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty || this.valuePlaceholder !== undefined;
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(req: boolean | string) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @HostBinding('class.file-input-disabled')
  public get isDisabled(): boolean {
    return this.disabled;
  }
  @Input()
  public get disabled(): boolean {
    return this._elementRef.nativeElement.disabled;
  }
  public set disabled(dis: boolean | string) {
    this.setDisabledState(coerceBooleanProperty(dis));
    this.stateChanges.next();
  }

  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input' && !this.disabled) {
      this._elementRef.nativeElement.querySelector('input').focus();
      this.focused = true;
      this.open();
    }
  }

  /**
   * @see https://angular.io/api/forms/ControlValueAccessor
   */
  public constructor(
    private fm: FocusMonitor,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    public override _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    @Self()
    public override ngControl: NgControl,
    @Optional() public override _parentForm: NgForm,
    @Optional() public override _parentFormGroup: FormGroupDirective,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl, new Subject<void>());

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(_elementRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  private _onChange: (_: unknown) => void = (_: unknown) => {
    return undefined;
  };
  private _onTouched: () => void = () => {
    return undefined;
  };

  public get fileNames(): string {
    return this.value ? this.value.fileNames : this.valuePlaceholder;
  }

  public writeValue(obj: FileInput | null): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', obj instanceof FileInput ? obj.files : null);
  }

  public registerOnChange(fn: () => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Remove all files from the file input component
   * @param [event] optional event that may have triggered the clear action
   */
  public clear(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.value = new FileInput([]);
    this._elementRef.nativeElement.querySelector('input').value = null;
    this._onChange(this.value);
  }

  @HostListener('change', ['$event'])
  public change(event: Event): void {
    const fileList: FileList | null = (<HTMLInputElement>event.target).files;
    const fileArray: File[] = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        fileArray.push(fileList[i]);
      }
    }
    this.value = new FileInput(fileArray);
    this._onChange(this.value);
  }

  @HostListener('focusout')
  public blur(): void {
    this.focused = false;
    this._onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  public ngOnInit(): void {
    this.multiple = coerceBooleanProperty(this.multiple);
  }

  public open(): void {
    if (!this.disabled) {
      this._elementRef.nativeElement.querySelector('input').click();
    }
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this._elementRef.nativeElement);
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean, or we risk destroying the performance.
      this.updateErrorState();
    }
  }
}
