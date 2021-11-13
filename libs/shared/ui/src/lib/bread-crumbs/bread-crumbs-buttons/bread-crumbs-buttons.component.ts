import { Component, Input } from '@angular/core';
import { IContextButton } from '../bread-crumbs.interface';

@Component({
  selector: 'biosimulations-bread-crumbs-buttons',
  templateUrl: './bread-crumbs-buttons.component.html',
  styleUrls: ['./bread-crumbs-buttons.component.scss'],
})
export class BreadCrumbsButtonsComponent {
  @Input()
  buttons: IContextButton[] = [];
}
