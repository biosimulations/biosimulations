import { Component, AfterViewInit, Output, EventEmitter, ViewChild, ViewChildren, ContentChildren, QueryList } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'biosimulations-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
})
export class TabPageComponent implements AfterViewInit {
  @Output() selectedTabChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  @ViewChildren(MatTab) tabs: QueryList<MatTab>;
  @ContentChildren(MatTab, {descendants: true}) tabsFromNgContent: QueryList<MatTab>;

  ngAfterViewInit(){
    this.matTabGroup._tabs.reset([...this.tabs.toArray(), ...this.tabsFromNgContent.toArray()]);
    this.matTabGroup._tabs.notifyOnChanges();
  }
}
