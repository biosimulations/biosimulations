import { async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { OkCancelDialogComponent } from './ok-cancel-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OkCancelDialogComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OkCancelDialogComponent],
      imports: [ MatDialogModule, BrowserAnimationsModule ],
      providers: [ MatDialogModule ],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ OkCancelDialogComponent ],
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
    const dialogRef = dialog.open(OkCancelDialogComponent, {
      data: {
        title: '1',
        click: () => {},
      },
    });

    // verify
    expect(dialogRef.componentInstance instanceof OkCancelDialogComponent).toBe(true);
  });
});
