import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-toc-item',
  templateUrl: './text-page-toc-item.component.html',
  styleUrls: ['./text-page-toc-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageTocItemComponent implements OnInit {
  @Input()
  title = '';

  @Input()
  scrollTarget!: any;

  constructor() {}

  ngOnInit(): void {}

  scrollToElement(): void {
    /* TODO: fix

    this.scrollTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    */
  }
}
