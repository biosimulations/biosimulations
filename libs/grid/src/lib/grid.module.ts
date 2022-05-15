import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { GridControlsComponent } from './controls/controls.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SearchComponent } from './search/search.component';
import { SelectComponent } from './select/select.component';
import { FilterComponent } from './filter/filter.component';
import { StringFilterComponent } from './filter/string-filter/string-filter.component';
import { AutoCompleteFilterComponent } from './filter/auto-complete-filter/auto-complete-filter.component';
import { NumberFilterComponent } from './filter/number-filter/number-filter.component';
import { DateFilterComponent } from './filter/date-filter/date-filter.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule, ReactiveFormsModule],
  declarations: [
    GridControlsComponent,
    SearchComponent,
    SelectComponent,
    FilterComponent,
    StringFilterComponent,
    AutoCompleteFilterComponent,
    NumberFilterComponent,
    DateFilterComponent,
  ],
  exports: [
    GridControlsComponent,
    SearchComponent,
    FilterComponent,
    AutoCompleteFilterComponent,
    NumberFilterComponent,
    DateFilterComponent,
    StringFilterComponent
  ],
})
export class GridModule {}
