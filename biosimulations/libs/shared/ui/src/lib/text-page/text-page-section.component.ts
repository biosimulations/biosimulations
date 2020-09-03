import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-section',
  templateUrl: './text-page-section.component.html',
  styleUrls: ['./text-page-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageSectionComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  icon = '';

  @Input()
  iconClick!: any;

  constructor() {}

  ngOnInit(): void {}
}
