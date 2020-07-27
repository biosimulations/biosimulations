import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { BiosimulationsIconsModule } from '@biosimulations/ui/icons';
import { StatsService } from './stats.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, UiMaterialModule, BiosimulationsIconsModule],

  providers: [StatsService]
})
export class HomeModule { }
