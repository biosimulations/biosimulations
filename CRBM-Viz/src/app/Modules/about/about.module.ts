import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [AboutComponent, HelpComponent],
  imports: [CommonModule, AboutRoutingModule],
})
export class AboutModule {}
