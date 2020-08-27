import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { DispatchPrivacyPolicyComponent } from './dispatch-privacy-policy.component';

describe('DispatchPrivacyPolicyComponent', () => {
  let component: DispatchPrivacyPolicyComponent;
  let fixture: ComponentFixture<DispatchPrivacyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DispatchPrivacyPolicyComponent,
      ],
      imports: [
        SharedUiModule,
        BiosimulationsIconsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
