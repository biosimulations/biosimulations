import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from '../../Shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [AboutComponent, HelpComponent],
  imports: [CommonModule, AboutRoutingModule, MaterialModule, SharedModule],
})
export class AboutModule {}
