import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageSectionComponent } from './text-page-section.component';
import { TextPageContentSectionComponent } from './text-page-content-section.component';

describe('TextPageContentSectionComponent', () => {
  let component: TextPageContentSectionComponent;
  let fixture: ComponentFixture<TextPageContentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageSectionComponent, TextPageContentSectionComponent],
      imports: [BiosimulationsIconsModule],
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
