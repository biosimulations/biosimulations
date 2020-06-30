import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UiMaterialModule } from '@biosimulations/ui/material';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, UiMaterialModule],
})
export class HomeModule {}
