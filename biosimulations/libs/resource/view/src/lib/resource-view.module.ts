import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
@NgModule({
  imports: [CommonModule, MarkdownModule.forChild(), UiMaterialModule],
  declarations: [ResourceViewComponent, ResourceOverviewComponent],
  exports: [ResourceOverviewComponent, ResourceViewComponent],
})
export class ResourceViewModule {}
