import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnderConstructionRoutingModule } from './under-construction-routing.module';
import { UnderConstructionComponent } from './under-construction.component';
import { SharedModule } from '../../Shared/shared.module';

@NgModule({
  declarations: [UnderConstructionComponent],
  imports: [CommonModule, UnderConstructionRoutingModule, SharedModule],
})
export class UnderConstructionModule {}
