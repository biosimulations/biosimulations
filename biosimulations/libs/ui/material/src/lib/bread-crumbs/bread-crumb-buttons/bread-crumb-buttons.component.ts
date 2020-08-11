import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IContextButton } from '../bread-crumbs.interface';

@Component({
  selector: 'biosimulations-bread-crumb-buttons',
  templateUrl: './bread-crumb-buttons.component.html',
  styleUrls: ['./bread-crumb-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbButtonsComponent implements OnInit {

  @Input()
  buttons: IContextButton[] = []
  constructor() { }

  ngOnInit(): void {
  }

}
