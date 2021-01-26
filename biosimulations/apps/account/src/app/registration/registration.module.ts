import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgreementComponent } from '../components/agreement/agreement.component';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
