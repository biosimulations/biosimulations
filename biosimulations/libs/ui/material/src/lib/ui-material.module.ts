import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { StepperButtonsComponent } from './next-previous-buttons/next-previous-buttons.component';
import { BiosimulationsNavigationComponent } from './biosimulations-navigation/biosimulations-navigation.component';
import { MaterialWrapperModule } from './material-wrapper.module';

import { ResourceViewModule } from './resource-view/resource-view.module';
import { SpinnerComponent } from './spinner/spinner.component';

const declarations = [
  TopbarComponent,
  StepperButtonsComponent,
  BiosimulationsNavigationComponent,
];
@NgModule({
  imports: [CommonModule, MaterialWrapperModule, ResourceViewModule],
  exports: [...declarations, MaterialWrapperModule, ResourceViewModule, SpinnerComponent],
  declarations: [...declarations, SpinnerComponent],
})
export class UiMaterialModule {}
