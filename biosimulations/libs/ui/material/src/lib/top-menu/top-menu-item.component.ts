import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'biosimulations-top-menu-item',
  templateUrl: './top-menu-item.component.html',
  styleUrls: ['./top-menu-item.component.scss'],
})
export class TopMenuItemComponent {
  @Input()
  title = '';

  @Input()
  icon = '';

  @Input()
  disabled = false;

  constructor() { }
}
