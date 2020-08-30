import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyNoticeComponent } from './privacy-policy-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialWrapperModule } from '../material-wrapper.module';

describe('PrivacyPolicyNoticeComponent', () => {
  let component: PrivacyPolicyNoticeComponent;
  let fixture: ComponentFixture<PrivacyPolicyNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyNoticeComponent],
      imports: [RouterTestingModule, MaterialWrapperModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
