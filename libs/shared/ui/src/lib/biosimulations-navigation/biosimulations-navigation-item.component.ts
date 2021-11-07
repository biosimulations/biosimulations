import {
  Component,
  Input,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { BiosimulationsNavigationSubitemComponent } from './biosimulations-navigation-subitem.component';

@Component({
  selector: 'biosimulations-navigation-item',
  templateUrl: './biosimulations-navigation-item.component.html',
  styleUrls: ['./biosimulations-navigation-item.component.scss'],
})
export class BiosimulationsNavigationItemComponent {
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  route: string | string[] = '';

  @Input()
  queryParams: { [key: string]: string } = {};

  @Input()
  href = '';

  @Input()
  aboveDivider = false;

  noExpansion = false;

  @ContentChildren(BiosimulationsNavigationSubitemComponent)
  set subitems(subitems: QueryList<BiosimulationsNavigationSubitemComponent>) {
    this.noExpansion = subitems.length === 0;
  }

  @Input()
  disabled = false;
}
