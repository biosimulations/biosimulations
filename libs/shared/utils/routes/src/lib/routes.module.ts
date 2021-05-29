import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkedPreloadingStrategy } from './MarkedPreloadingStrategy';
export const MARKED_PRELOADING_STRATEGY = MarkedPreloadingStrategy;
@NgModule({
  imports: [CommonModule],
  providers: [MARKED_PRELOADING_STRATEGY],
})
export class RoutesModule {}
