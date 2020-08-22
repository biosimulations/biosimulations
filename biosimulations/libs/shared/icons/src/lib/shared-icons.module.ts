import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon/icon.component';
import { MatIconModule } from '@angular/material/icon';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import {
  fas,
  faFilm,
  faUsers,
  faDna,
  faBezierCurve,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far, faFile, faUser } from '@fortawesome/free-regular-svg-icons';
import { MatIconComponent } from './mat-icon/mat-icon.component';
import { CCIconComponent } from './cc-icon/cc-icon.component';
export {biosimulationsIcon} from './icon/icon.component'
@NgModule({
  imports: [CommonModule, MatIconModule, FontAwesomeModule],
  declarations: [
    IconComponent,
    FaIconComponent,
    MatIconComponent,
    CCIconComponent,
  ],
  exports: [IconComponent,],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BiosimulationsIconsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(far);
    library.addIconPacks(fas);
    library.addIconPacks(fab);
  }
}
