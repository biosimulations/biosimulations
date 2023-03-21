import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgreementComponent } from '../components/agreement/agreement.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MarkdownModule } from 'ngx-markdown';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

const routes: Routes = [{ path: '', component: RegistrationComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedUiModule,
    MatFormFieldModule,
    MatStepperModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    MarkdownModule.forChild(),
    SharedDebugModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [RegistrationComponent, AgreementComponent],
})
export class RegistrationModule {}
