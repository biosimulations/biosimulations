import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgreementComponent } from '../components/agreement/agreement.component';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { DebugModule } from '@biosimulations/shared/debug';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [{ path: '', component: RegistrationComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UiMaterialModule,
    MatFormFieldModule,
    MatStepperModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    MarkdownModule.forChild(),
    DebugModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [RegistrationComponent, AgreementComponent],
})
export class RegistrationModule {}
