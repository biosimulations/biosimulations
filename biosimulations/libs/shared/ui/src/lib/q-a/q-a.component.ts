import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-q-a',
  templateUrl: './q-a.component.html',
  styleUrls: ['./q-a.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QAComponent {
  @Input()
  heading = '';
}
