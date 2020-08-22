import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { HelpComponent } from './help/help.component';



@NgModule({
  declarations: [AboutComponent, HelpComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,

    BiosimulationsIconsModule,
  ]
})
export class AboutModule { }
