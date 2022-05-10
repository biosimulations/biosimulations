import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { GridControlsComponent } from './controls/controls.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SearchComponent } from './search/search.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
  declarations: [GridControlsComponent, SearchComponent, SelectComponent],
  exports: [GridControlsComponent, SearchComponent],
})
export class GridModule {}
