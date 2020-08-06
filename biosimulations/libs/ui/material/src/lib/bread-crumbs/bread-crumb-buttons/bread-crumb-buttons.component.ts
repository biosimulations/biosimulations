import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';


interface NavItem {
  icon: string
  route: string
  label: string

}
@Component({
  selector: 'biosimulations-bread-crumb-buttons',
  templateUrl: './bread-crumb-buttons.component.html',
  styleUrls: ['./bread-crumb-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbButtonsComponent implements OnInit {

  @Input()
  buttons: NavItem[] = []
  constructor() { }

  ngOnInit(): void {
  }

}
