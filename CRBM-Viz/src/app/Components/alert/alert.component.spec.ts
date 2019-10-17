import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
describe('AlertComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AlertComponent],
      },
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(AlertComponent, {
      data: { param: '1' },
    });

    // verify
    expect(dialogRef.componentInstance instanceof AlertComponent).toBe(true);
  });
});
