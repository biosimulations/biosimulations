import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { ResourceViewComponent } from './resource-view.component';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { MarkdownModule } from 'ngx-markdown';
@NgModule({
  declarations: [ResourceViewComponent, ResourceOverviewComponent],
  imports: [CommonModule, MaterialWrapperModule, MarkdownModule.forChild()],
  exports: [ResourceViewComponent, ResourceOverviewComponent],
})
export class ResourceViewModule {}
