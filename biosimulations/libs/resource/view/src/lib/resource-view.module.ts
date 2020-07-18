import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { ResourceAttributesComponent } from './resource-attributes/resource-attributes.component';
import { BiosimulationsIconsModule } from '@biosimulations/ui/icons';
@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    UiMaterialModule,
    BiosimulationsIconsModule,
  ],
  declarations: [
    ResourceViewComponent,
    ResourceOverviewComponent,
    ResourceAttributesComponent,
  ],
  exports: [
    ResourceOverviewComponent,
    ResourceViewComponent,
    ResourceAttributesComponent,
  ],
})
export class ResourceViewModule {}
