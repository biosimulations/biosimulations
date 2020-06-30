import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TopbarComponent } from './topbar/topbar.component';
import { StepperButtonsComponent } from './next-previous-buttons/next-previous-buttons.component';
import { BiosimulationsNavigationComponent } from './biosimulations-navigation/biosimulations-navigation.component';
import { MaterialWrapperModule } from './material-wrapper.module';
import { MatNavList } from '@angular/material/list';

const declarations = [
  TopbarComponent,
  StepperButtonsComponent,
  BiosimulationsNavigationComponent,
];
@NgModule({
  imports: [CommonModule, MaterialWrapperModule],
  exports: [...declarations, MaterialWrapperModule],
  declarations: [...declarations],
})
export class UiMaterialModule {}
