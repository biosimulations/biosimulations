import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { PlatformTermsOfServiceComponent } from './platform-terms-of-service.component';

describe('PlatformTermsOfServiceComponent', () => {
  let component: PlatformTermsOfServiceComponent;
  let fixture: ComponentFixture<PlatformTermsOfServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformTermsOfServiceComponent],
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule],
      providers: [ConfigService, ScrollService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
