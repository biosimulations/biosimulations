import { Component, Input, ViewChild } from '@angular/core';
import { MatTab } from '@angular/material/tabs';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-tab-page-tab',
  templateUrl: './tab-page-tab.component.html',
  styleUrls: ['./tab-page-tab.component.scss'],
})
export class TabPageTabComponent {
  @Input()
  urlHashFragment?: string;

  @Input()
  heading!: string;

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  partialWidth = false;

  @Input()
  fullHeight = false;

  @Input()
  disabled = false;

  @Input()
  loading = false;

  @ViewChild(MatTab) tab!: MatTab;
}
