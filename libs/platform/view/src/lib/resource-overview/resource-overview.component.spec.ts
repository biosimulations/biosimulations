import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAttributesComponent } from '../resource-attributes/resource-attributes.component';
import { MarkdownModule } from 'ngx-markdown';

import { ResourceOverviewComponent } from './resource-overview.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
describe('ResourceOverviewComponent', () => {
  let component: ResourceOverviewComponent;
  let fixture: ComponentFixture<ResourceOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedUiModule,
        BiosimulationsIconsModule,
        MarkdownModule.forRoot(),
      ],
      declarations: [ResourceOverviewComponent, ResourceAttributesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
