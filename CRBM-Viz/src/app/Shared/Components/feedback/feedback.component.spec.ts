import { async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedbackComponent } from './feedback.component';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FeedbackComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent],
      imports: [ HttpClientTestingModule, RouterTestingModule, MaterialModule, MatDialogModule, BrowserAnimationsModule ],
      providers: [ HttpClientTestingModule, RouterTestingModule, MatDialogModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ FeedbackComponent ],
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
    const dialogRef = dialog.open(FeedbackComponent, {
      data: {
        title: '1',
        click: () => {},
      },
    });

    // verify
    expect(dialogRef.componentInstance instanceof FeedbackComponent).toBe(true);
  });
});
