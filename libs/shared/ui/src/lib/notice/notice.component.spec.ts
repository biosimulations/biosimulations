import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeComponent } from './notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('NoticeComponent', () => {
  let component: NoticeComponent;
  let fixture: ComponentFixture<NoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeComponent],
      imports: [
        RouterTestingModule,
        IonicStorageModule.forRoot({
          driverOrder: ['indexeddb', 'websql', 'localstorage'],
        }),
        MaterialWrapperModule,
        BiosimulationsIconsModule,
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
