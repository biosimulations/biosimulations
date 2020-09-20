import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageSectionComponent } from './text-page-section.component';
import { TextPageSideBarSectionComponent } from './text-page-side-bar-section.component';

describe('TextPageSideBarSectionComponent', () => {
  let component: TextPageSideBarSectionComponent;
  let fixture: ComponentFixture<TextPageSideBarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageSectionComponent, TextPageSideBarSectionComponent],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageSideBarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
