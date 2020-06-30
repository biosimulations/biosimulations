import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'biosimulations-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewModelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
