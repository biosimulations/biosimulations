import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentComponent } from './cookie-consent.component';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigService } from '@biosimulations/config/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatExpansionModule, MatSlideToggleModule, NoopAnimationsModule],
      declarations: [ CookieConsentComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        { provide: ConfigService, useValue: {
          appName: "testApp"
        } },
      ],
    })
    .compileComponents();
  })
  beforeEach(() => {
    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});