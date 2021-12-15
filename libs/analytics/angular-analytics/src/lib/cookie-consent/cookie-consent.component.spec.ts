import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentComponent } from './cookie-consent.component';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_NAME_TOKEN, ANALYTICS_ID_TOKEN } from '../datamodel';

describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatExpansionModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
      ],
      declarations: [CookieConsentComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        {
          provide: APP_NAME_TOKEN,
          useValue: 'testApp',
        },
        {
          provide: ANALYTICS_ID_TOKEN,
          useValue: 'G-1234567891',
        },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
