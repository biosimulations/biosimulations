import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyNoticeComponent } from './privacy-policy-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('PrivacyPolicyNoticeComponent', () => {
  let component: PrivacyPolicyNoticeComponent;
  let fixture: ComponentFixture<PrivacyPolicyNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyNoticeComponent],
      imports: [
        RouterTestingModule,
        IonicStorageModule.forRoot({
          driverOrder: ['indexeddb', 'websql', 'localstorage']
        }),
        MaterialWrapperModule,
        BiosimulationsIconsModule,
      ],
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
