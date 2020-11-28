import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-side-bar-section',
  templateUrl: './text-page-side-bar-section.component.html',
  styleUrls: ['./text-page-side-bar-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageSideBarSectionComponent {
  @Input()
  heading = '';

  @Input()
  highlight = false;
}
