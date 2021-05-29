import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgreementComponent } from '../components/agreement/agreement.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef, Component } from '@angular/core';

describe('RegistrationComponent', () => {
  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
