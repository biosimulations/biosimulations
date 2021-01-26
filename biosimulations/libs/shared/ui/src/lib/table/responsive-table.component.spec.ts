import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NpnSliderModule } from 'npn-slider';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ResponsiveTableComponent } from './responsive-table.component';
import { TableComponent } from './table.component';
import { StackedTableComponent } from './stacked-table.component';
import { PageComponent } from '../page/page.component';
import { TextPageComponent } from '../text-page/text-page.component';
import { TextPageSectionComponent } from '../text-page/text-page-section.component';
import { TextPageContentSectionComponent } from '../text-page/text-page-content-section.component';
import { TextPageSideBarSectionComponent } from '../text-page/text-page-side-bar-section.component';
import { TextPageTocItemComponent } from '../text-page/text-page-toc-item.component';
import { TocSectionDirective } from '../toc/toc-section.directive';
import { TocSectionsContainerDirective } from '../toc/toc-sections-container.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('ResponsiveTableComponent', () => {
  let component: ResponsiveTableComponent;
  let fixture: ComponentFixture<ResponsiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatExpansionModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NpnSliderModule,
        BiosimulationsIconsModule,
        FlexLayoutModule,
        MatTooltipModule,
      ],
      declarations: [
        ResponsiveTableComponent,
        TableComponent,
        StackedTableComponent,
        PageComponent,
        TextPageComponent,
        TextPageSectionComponent,
        TextPageContentSectionComponent,
        TextPageSideBarSectionComponent,
        TextPageTocItemComponent,
        TocSectionDirective,
        TocSectionsContainerDirective,
        SpinnerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
