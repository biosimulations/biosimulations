import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { GridControlsComponent } from './controls/controls.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
  declarations: [GridControlsComponent],
  exports: [GridControlsComponent],
})
export class GridModule {}
