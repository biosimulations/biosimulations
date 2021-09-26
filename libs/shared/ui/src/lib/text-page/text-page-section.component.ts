import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-text-page-section',
  templateUrl: './text-page-section.component.html',
  styleUrls: ['./text-page-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageSectionComponent {
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  iconRouterLink!: any[] | string | null;

  @Input()
  iconHref!: string | null;

  @Input()
  iconClick!: (() => void) | null;

  @Input()
  highlight = false;

  @Input()
  compact = false;

  @Input()
  first = false;

  @Input()
  last = false;

  @Input()
  closed = false;
}
