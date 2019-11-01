import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatInputModule,
  MatTabsModule,
  MatOption,
  MatOptionModule,
  MatSortModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTooltipModule,
  MatExpansionModule,
} from '@angular/material';

const MaterialComponents = [
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatInputModule,
  MatTabsModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTooltipModule,
  MatExpansionModule,
];
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
})
export class MaterialModule {}
