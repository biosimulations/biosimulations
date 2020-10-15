import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceViewComponent } from './resource-view.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ResourceOverviewComponent } from '../resource-overview/resource-overview.component';
import { VariablesViewComponent } from '../variables-view/variables-view.component';
import { ParametersViewComponent } from '../parameters-view/parameters-view.component';
import { ResourceAttributesComponent } from '../resource-attributes/resource-attributes.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatTableModule } from '@angular/material/table';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('ResourceViewComponent', () => {
  let component: ResourceViewComponent;
  let fixture: ComponentFixture<ResourceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedUiModule,
        SharedDebugModule,
        BiosimulationsIconsModule,
        MarkdownModule.forRoot(),
        MatTableModule,
        NoopAnimationsModule,
      ],
      declarations: [
        ResourceViewComponent,
        ResourceOverviewComponent,
        VariablesViewComponent,
        ParametersViewComponent,
        ResourceAttributesComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceViewComponent);
    component = fixture.componentInstance;
    component.tags = [' '];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
