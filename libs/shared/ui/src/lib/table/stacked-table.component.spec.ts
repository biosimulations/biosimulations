import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { PageComponent } from '../page/page.component';
import { TextPageComponent } from '../text-page/text-page.component';
import { TextPageSectionComponent } from '../text-page/text-page-section.component';
import { TextPageContentSectionComponent } from '../text-page/text-page-content-section.component';
import { TextPageSideBarSectionComponent } from '../text-page/text-page-side-bar-section.component';
import { TextPageTocItemComponent } from '../text-page/text-page-toc-item.component';
import { StackedTableComponent } from './stacked-table.component';
import { TocSectionDirective } from '../toc/toc-section.directive';
import { TocSectionsContainerDirective } from '../toc/toc-sections-container.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollService } from '@biosimulations/shared/angular';

describe('StackedTableComponent', () => {
  let component: StackedTableComponent;
  let fixture: ComponentFixture<StackedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        BiosimulationsIconsModule,
        FlexLayoutModule,
      ],
      declarations: [
        StackedTableComponent,
        PageComponent,
        TextPageComponent,
        TextPageSectionComponent,
        TextPageContentSectionComponent,
        TextPageSideBarSectionComponent,
        TextPageTocItemComponent,
        TocSectionDirective,
        TocSectionsContainerDirective,
      ],
      providers: [ScrollService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
