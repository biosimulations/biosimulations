import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { ResourceViewComponent } from './resource-view.component';
import { MaterialWrapperModule } from '../material-wrapper.module';

@NgModule({
  declarations: [ResourceViewComponent, ResourceOverviewComponent],
  imports: [CommonModule, MaterialWrapperModule],
  exports: [ResourceViewComponent],
})
export class ResourceViewModule {}
