import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabsModule } from '@angular/material/tabs';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TabPageTabComponent } from './tab-page-tab.component';

describe('TabPageTabComponent', () => {
  let component: TabPageTabComponent;
  let fixture: ComponentFixture<TabPageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabPageTabComponent],
      imports: [MatTabsModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
