import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MetadataDialogComponent } from './metadata-dialog.component';
import { MetadataComponent } from '../metadata/metadata.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { ScrollService } from '@biosimulations/shared/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('MetadataDialogComponent', () => {
  let component: MetadataDialogComponent;
  let fixture: ComponentFixture<MetadataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedUiModule, RouterTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: '',
          },
        },
        ScrollService,
      ],
      declarations: [MetadataDialogComponent, MetadataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
