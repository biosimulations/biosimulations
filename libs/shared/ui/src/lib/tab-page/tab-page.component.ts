import {
  Component,
  AfterViewInit,
  AfterViewChecked,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ContentChildren,
  QueryList,
  DoCheck,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTab, MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { TabPageTabComponent } from './tab-page-tab.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

/**
 * A container for a set of tabs. Effectively a wrapper for a `<mat-tab-group>` with some added
 * functionality such as automatically setting url fragments and navigating to tabs based on the url
 *
 */
@Component({
  selector: 'biosimulations-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
  /*
   * This works, because the only changes to state are either the url changing which is handled via a router redirect
   * or projected content changes which trigger the change detection with the onPush strategy
   */
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPageComponent implements AfterViewInit, AfterViewChecked {
  @Input()
  public loading = false;

  @Output()
  public selectedTabChange: EventEmitter<MatTabChangeEvent> = new EventEmitter();

  @Input()
  public selectedTabIndex = 0;

  @ViewChild(MatTabGroup)
  private matTabGroup!: MatTabGroup;

  @ContentChildren(TabPageTabComponent, { descendants: true })
  private tabs!: QueryList<TabPageTabComponent>;

  private urlHashFragmentToITabMap: { [urlHashFragment: string]: number } = {};
  private iTabToUrlHashFragmentMap: { [iTab: number]: string } = {};
  private subscriptions: Array<Subscription> = [];
  public constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Runs after each change detection check is complete for content ptojected into content.
   * Used to ensure that the containing components updates when changes occur to projected content
   * For example, if we have a tab that is conditional on an observable, it won't be present in the query list at the
   * time that the that the view is initialized and thus not detected by the ngAfterViewInit lifecycle hook.
   *
   */
  public ngAfterContentChecked(): void {
    this.processTabChanges();
  }
  /**
   * Runs after the view is initialized. We use this instead of the ngOnInit lifecycle hook because
   * we need to wait for the projected content to be initialized. The tabs will be undefined until the projected
   * content initializes. Simmilar, processing the url hash fragment only makes sense once we have tabs present.
   */
  public ngAfterViewInit(): void {
    this.processTabChanges();
    this.proccessURLHashFragment();
  }

  public ngAfterViewChecked(): void {
    this.matTabGroup.realignInkBar();
  }

  public tabChanged(event: MatTabChangeEvent): void {
    this.selectedTabChange.emit(event);
    let params = new URLSearchParams();
    if (this.route.snapshot.fragment) {
      params = new URLSearchParams(this.route.snapshot.fragment);
    }
    if (this.selectedTabIndex in this.iTabToUrlHashFragmentMap) {
      const urlHashFragment: string =
        this.iTabToUrlHashFragmentMap[this.selectedTabIndex];
      params.set('tab', urlHashFragment);
    } else if (params.has('tab')) {
      params.delete('tab');
    }
    this.router.navigate([], { fragment: params.toString() || undefined });
  }
  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription): void => sub.unsubscribe());
  }
  private proccessURLHashFragment(): void {
    const sub = combineLatest([
      this.route.paramMap,
      this.route.fragment,
    ]).subscribe((params: [ParamMap, string | null]): void => {
      let selectedTabIndex = 0;
      const fragment = params[1];
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const tab = params.get('tab');
        if (tab && this.urlHashFragmentToITabMap?.[tab]) {
          selectedTabIndex = this.urlHashFragmentToITabMap[tab];
          /*
            if (baseTabs[selectedTabIndex].disabled) {
              selectedTabIndex = 0;
            }
            */
        }
      }
      setTimeout(() => (this.selectedTabIndex = selectedTabIndex), 0);
    });
    this.subscriptions.push(sub);
  }
  private processTabChanges(): void {
    const baseTabs: MatTab[] = [];
    this.urlHashFragmentToITabMap = {};
    this.iTabToUrlHashFragmentMap = {};
    if (this.tabs) {
      this.tabs
        .toArray()
        .forEach((tab: TabPageTabComponent, iTab: number): void => {
          baseTabs.push(tab.tab);
          if (tab.urlHashFragment) {
            this.urlHashFragmentToITabMap[tab.urlHashFragment] = iTab;
            this.iTabToUrlHashFragmentMap[iTab] = tab.urlHashFragment;
          }
        });
    }
    if (this.matTabGroup) {
      this.matTabGroup._tabs.reset(baseTabs);
      this.matTabGroup._tabs.notifyOnChanges();
    }
  }
}
