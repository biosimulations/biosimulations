import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors.component';
import { SharedModule } from '../Shared/shared.module';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [ErrorsComponent],
  imports: [CommonModule, SharedModule, ErrorsRoutingModule, FontAwesomeModule],
})
export class ErrorsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBug);
  }
}
