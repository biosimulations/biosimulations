import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService } from '@biosimulations/shared/angular';
import { TextPageFeedbackSideBarSectionComponent } from './text-page-feedback-side-bar-section.component';

describe('TextPageFeedbackSideBarSectionComponent', () => {
  let component: TextPageFeedbackSideBarSectionComponent;
  let fixture: ComponentFixture<TextPageFeedbackSideBarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageFeedbackSideBarSectionComponent],
      imports: [SharedUiModule, BiosimulationsIconsModule],
      providers: [ConfigService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageFeedbackSideBarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
