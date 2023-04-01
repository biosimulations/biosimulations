import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { FeaturedComponent } from './featured/featured.component';

@NgModule({
  declarations: [HomeComponent, FeaturedComponent],

  imports: [CommonModule, HomeRoutingModule, SharedUiModule, BiosimulationsIconsModule, MatIconModule, MatCardModule],
})
export class HomeModule {}
