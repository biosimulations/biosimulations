import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { HelpComponent } from './help.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule, SharedContentModule],
      providers: [RouterTestingModule],
      declarations: [HelpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
