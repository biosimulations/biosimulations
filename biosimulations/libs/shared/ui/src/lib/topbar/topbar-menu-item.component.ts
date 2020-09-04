import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-topbar-menu-item',
  templateUrl: './topbar-menu-item.component.html',
  styleUrls: ['./topbar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarMenuItemComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  icon = '';

  @Input()
  route = '';

  @Input()
  disabled = false;

  constructor() {}

  ngOnInit(): void {}
}
