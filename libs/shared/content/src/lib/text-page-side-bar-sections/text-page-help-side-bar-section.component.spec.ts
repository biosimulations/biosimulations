import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService } from '@biosimulations/shared/services';
import { TextPageHelpSideBarSectionComponent } from './text-page-help-side-bar-section.component';

describe('TextPageHelpSideBarSectionComponent', () => {
  let component: TextPageHelpSideBarSectionComponent;
  let fixture: ComponentFixture<TextPageHelpSideBarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageHelpSideBarSectionComponent],
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule],
      providers: [ConfigService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageHelpSideBarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
