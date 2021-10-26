import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ErrorComponent } from './error.component';
import { Error500DialogComponent } from './error-500-dialog.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@biosimulations/shared/angular';

describe('Error500DialogComponent', () => {
  let component: Error500DialogComponent;
  let fixture: ComponentFixture<Error500DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, Error500DialogComponent],
      imports: [
        RouterTestingModule,
        BiosimulationsIconsModule,
        MatDialogModule,
      ],
      providers: [
        ConfigService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error500DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
