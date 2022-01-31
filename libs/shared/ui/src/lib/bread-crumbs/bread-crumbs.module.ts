import { NgModule } from '@angular/core';
import { BreadCrumbsButtonsComponent } from './bread-crumbs-buttons/bread-crumbs-buttons.component';
import { CommonModule } from '@angular/common';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { RouterModule } from '@angular/router';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BreadCrumbsComponent } from './bread-crumbs.component';
import { BreadCrumbsButtonComponent } from './bread-crumbs-button/bread-crumbs-button.component';
import { BreadCrumbsPositionComponent } from './bread-crumbs-position/bread-crumbs-position.component';
import { SharedAngularModule } from '@biosimulations/shared/angular';

@NgModule({
  declarations: [
    BreadCrumbsButtonsComponent,
    BreadCrumbsComponent,
    BreadCrumbsButtonComponent,
    BreadCrumbsPositionComponent,
  ],
  imports: [
    CommonModule,
    MaterialWrapperModule,
    RouterModule,
    BiosimulationsIconsModule,
    SharedAngularModule,
  ],
  exports: [
    BreadCrumbsComponent,
    BreadCrumbsButtonComponent,
    BreadCrumbsPositionComponent,
  ],
})
export class BreadCrumbsModule {}
