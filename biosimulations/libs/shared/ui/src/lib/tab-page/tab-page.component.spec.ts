import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabsModule } from '@angular/material/tabs';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TabPageComponent } from './tab-page.component';
import { TabPageTabComponent } from './tab-page-tab.component';

describe('TabPageComponent', () => {
  let component: TabPageComponent;
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabPageComponent, TabPageTabComponent],
      imports: [MatTabsModule, BiosimulationsIconsModule],
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
