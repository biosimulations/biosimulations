import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { MatTab, MatTabGroup, MAT_TAB_GROUP } from '@angular/material/tabs';
import { TabPageTabComponent } from './tab-page-tab.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
  /*
   *Not sure why this is needed.
   * The page-tab-tab component has <mat-tab> elements that fail to find the mat tab group to inject.
   * Providing the injection token here somehow fixes the problem. The mat tab group component used here should be the same one that is being provided
   */
  providers: [
    {
      provide: MAT_TAB_GROUP,
      useClass: MatTabGroup,
    },
  ],
})
export class TabPageComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  @Input()
  loading = false;

  @Output() selectedTabChange: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatTabGroup) matTabGroup!: MatTabGroup;
  @ContentChildren(TabPageTabComponent, { descendants: true }) tabs!: QueryList<
    TabPageTabComponent
  >;

  selectedTabIndex = 0;

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.selectedTabIndex = 0;
    });
  }

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
