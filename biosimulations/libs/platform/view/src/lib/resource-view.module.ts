import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { ResourceAttributesComponent } from './resource-attributes/resource-attributes.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ReferencesViewComponent } from './references-view/references-view.component';
import { TagsViewComponent } from './tags-view/tags-view.component';
import { AuthorsViewComponent } from './authors-view/authors-view.component';
import { VariablesViewComponent } from './variables-view/variables-view.component';
import { ParametersViewComponent } from './parameters-view/parameters-view.component';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { MatTableModule } from '@angular/material/table';
import { ResourceHomeComponent } from './resource-home/resource-home.component';
import { ResourceHomeFeatureComponent } from './resource-home/resource-home-feature.component';
import { ResourceHomeFeaturesComponent } from './resource-home/resource-home-features.component';
@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    SharedDebugModule,
    BiosimulationsIconsModule,
    SharedUiModule,
    MatTableModule,
  ],
  declarations: [
    ResourceViewComponent,
    ResourceOverviewComponent,
    ResourceAttributesComponent,
    ReferencesViewComponent,
    TagsViewComponent,
    AuthorsViewComponent,
    VariablesViewComponent,
    ParametersViewComponent,
    ResourceHomeComponent,
    ResourceHomeFeatureComponent,
    ResourceHomeFeaturesComponent,
  ],
  exports: [
    ResourceOverviewComponent,
    ResourceViewComponent,
    ResourceAttributesComponent,
    ReferencesViewComponent,
    TagsViewComponent,
    AuthorsViewComponent,
    VariablesViewComponent,
    ParametersViewComponent,
    ResourceHomeComponent,
    ResourceHomeFeatureComponent,
    ResourceHomeFeaturesComponent,
  ],
})
export class ResourceViewModule {}
