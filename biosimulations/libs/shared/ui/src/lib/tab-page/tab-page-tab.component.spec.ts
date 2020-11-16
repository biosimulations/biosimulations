import {
  Component,
  ContentChildren,
  QueryList,
  ViewChild,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatProgressSpinnerModule,
  MatSpinner,
} from '@angular/material/progress-spinner';

import {
  MatTab,
  MatTabGroup,
  MatTabsModule,
  MAT_TAB_GROUP,
} from '@angular/material/tabs';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { FullPageSpinnerComponent } from '../spinner/full-page-spinner.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TabPageTabComponent } from './tab-page-tab.component';
import { TabPageComponent } from './tab-page.component';

@Component({
  selector: `host-component`,
  template: `<mat-tab-group>
    <biosimulations-tab-page-tab heading="Overview" icon="overview">
      <div class="testClass">textContent</div>
    </biosimulations-tab-page-tab>
    <biosimulations-tab-page-tab heading="Overview" icon="overview">
      <div class="testClass">textContent</div>
    </biosimulations-tab-page-tab>
    <biosimulations-tab-page-tab heading="Overview" icon="overview">
      <div class="testClass">textContent</div>
    </biosimulations-tab-page-tab>
  </mat-tab-group>`,
})
class TestHostComponent {
  @ViewChild(MatTabGroup) matTabGroup!: MatTabGroup;
  @ContentChildren(TabPageTabComponent, { descendants: true }) tabs!: QueryList<
    TabPageTabComponent
  >;
  ngAfterViewInit(): void {
    const baseTabs: MatTab[] = [];
    for (const tab of this.tabs.toArray()) {
      baseTabs.push(tab.tab);
    }
    this.matTabGroup._tabs.reset(baseTabs);
    this.matTabGroup._tabs.notifyOnChanges();
  }

  ngAfterViewChecked(): void {
    this.matTabGroup.realignInkBar();
  }
}
describe('TabPageTabComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: TabPageTabComponent;
  let fixture: ComponentFixture<TabPageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabPageTabComponent, TestHostComponent],
      imports: [
        MatTabsModule,
        BiosimulationsIconsModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: MAT_TAB_GROUP,
          useClass: MatTabGroup,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
    testHostComponent.ngAfterViewInit();
    testHostComponent.ngAfterViewChecked();
  });

  it('should compile', () => {
    expect(testHostComponent).toBeTruthy();
  });
  it('Should contain tab group', () => {
    expect(testHostFixture.componentInstance.matTabGroup).toBeTruthy();
  });
});
