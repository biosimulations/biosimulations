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
  MatSortModule
];
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
})
export class MaterialModule {}
