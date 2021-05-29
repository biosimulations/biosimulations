import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageCitationSideBarSectionComponent } from './text-page-citation-side-bar-section.component';

describe('TextPageCitationSideBarSectionComponent', () => {
  let component: TextPageCitationSideBarSectionComponent;
  let fixture: ComponentFixture<TextPageCitationSideBarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageCitationSideBarSectionComponent],
      imports: [SharedUiModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageCitationSideBarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
