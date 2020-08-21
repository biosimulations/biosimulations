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
  title: string = '';

  @Input()
  icon: string = '';

  @Input()
  disabled: boolean = false;

  constructor() { }
}
