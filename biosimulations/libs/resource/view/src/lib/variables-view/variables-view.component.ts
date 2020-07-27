import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-variables-view',
  templateUrl: './variables-view.component.html',
  styleUrls: ['./variables-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariablesViewComponent implements OnInit {

  @Input()
  list: any
  displayedColumns = ["id", "name", "type", "units", "description"]
  constructor() { }

  ngOnInit(): void {
  }

}
