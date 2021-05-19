import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DeleteSimulationsDialogComponent } from './delete-simulations-dialog.component';

describe('DeleteSimulationsDialogComponent', () => {
  let component: DeleteSimulationsDialogComponent;
  let fixture: ComponentFixture<DeleteSimulationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
      ],
      declarations: [DeleteSimulationsDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSimulationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
