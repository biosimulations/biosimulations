import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { SimulatorsTermsOfServiceComponent } from './simulators-terms-of-service.component';

describe('SimulatorsTermsOfServiceComponent', () => {
  let component: SimulatorsTermsOfServiceComponent;
  let fixture: ComponentFixture<SimulatorsTermsOfServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimulatorsTermsOfServiceComponent],
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule],
      providers: [ConfigService, ScrollService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorsTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
