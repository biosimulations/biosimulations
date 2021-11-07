import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-q-a',
  templateUrl: './q-a.component.html',
  styleUrls: ['./q-a.component.scss'],
})
export class QAComponent {
  @Input()
  heading = '';
}
