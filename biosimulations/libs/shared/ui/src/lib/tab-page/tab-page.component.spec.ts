import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabsModule } from '@angular/material/tabs';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TabPageComponent } from './tab-page.component';
import { TabPageTabComponent } from './tab-page-tab.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FullPageSpinnerComponent } from '../spinner/full-page-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

describe('TabPageComponent', () => {
  let component: TabPageComponent;
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabPageComponent,
        TabPageTabComponent,
        FullPageSpinnerComponent,
        SpinnerComponent,
      ],
      imports: [
        MatTabsModule,
        BiosimulationsIconsModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
