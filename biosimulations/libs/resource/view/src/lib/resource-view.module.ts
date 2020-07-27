import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ResourceViewComponent } from './resource-view/resource-view.component';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { ResourceAttributesComponent } from './resource-attributes/resource-attributes.component';
import { BiosimulationsIconsModule } from '@biosimulations/ui/icons';
import { ReferencesViewComponent } from './references-view/references-view.component';
import { TagsViewComponent } from './tags-view/tags-view.component';
import { AuthorsViewComponent } from './authors-view/authors-view.component';
import { VariablesViewComponent } from './variables-view/variables-view.component';
import { ParametersViewComponent } from './parameters-view/parameters-view.component';
import { DebugModule } from '@biosimulations/shared/debug'
import { MatTableModule } from '@angular/material/table'
@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    UiMaterialModule,
    BiosimulationsIconsModule,
    DebugModule,
    MatTableModule
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
  ],
})
export class ResourceViewModule { }
