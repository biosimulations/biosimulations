import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageSectionComponent } from './text-page-section.component';
import { TextPageContentSectionComponent } from './text-page-content-section.component';
import { ScrollService } from '@biosimulations/shared/angular';

describe('TextPageContentSectionComponent', () => {
  let component: TextPageContentSectionComponent;
  let fixture: ComponentFixture<TextPageContentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageSectionComponent, TextPageContentSectionComponent],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
      providers: [ScrollService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageContentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
