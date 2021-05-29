import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageSectionComponent } from './text-page-section.component';

describe('TextPageSectionComponent', () => {
  let component: TextPageSectionComponent;
  let fixture: ComponentFixture<TextPageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageSectionComponent],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
