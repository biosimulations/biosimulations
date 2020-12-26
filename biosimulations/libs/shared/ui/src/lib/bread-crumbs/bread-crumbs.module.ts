import { NgModule } from '@angular/core';
import { BreadCrumbButtonsComponent } from './bread-crumb-buttons/bread-crumb-buttons.component';
import { CommonModule } from '@angular/common';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { RouterModule } from '@angular/router';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BreadCrumbsComponent } from './bread-crumbs.component';
import { BreadCrumbsButtonComponent } from './bread-crumbs-button/bread-crumbs-button.component';

@NgModule({
  declarations: [BreadCrumbButtonsComponent, BreadCrumbsComponent, BreadCrumbsButtonComponent],
  imports: [CommonModule, MaterialWrapperModule, RouterModule, BiosimulationsIconsModule
  ],
  exports: [BreadCrumbsComponent]
})
export class BreadCrumbsModule { }
