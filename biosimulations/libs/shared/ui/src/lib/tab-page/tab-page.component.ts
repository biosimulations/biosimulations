import { Component, AfterViewInit, Output, EventEmitter, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TabPageTabComponent } from './tab-page-tab.component';

@Component({
  selector: 'biosimulations-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
})
export class TabPageComponent implements AfterViewInit {
  @Output() selectedTabChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  @ViewChild(MatTabGroup) matTabGroup!: MatTabGroup;
  @ContentChildren(TabPageTabComponent, {descendants: true}) tabs!: QueryList<TabPageTabComponent>;

  ngAfterViewInit(){
    const baseTabs: MatTab[] = [];
    for (const tab of this.tabs.toArray()) {
      baseTabs.push(tab.tab);
    }
    this.matTabGroup._tabs.reset(baseTabs);
    this.matTabGroup._tabs.notifyOnChanges();
  }
}
