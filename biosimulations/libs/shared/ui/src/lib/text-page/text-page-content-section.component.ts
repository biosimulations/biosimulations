import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-content-section',
  templateUrl: './text-page-content-section.component.html',
  styleUrls: ['./text-page-content-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageContentSectionComponent implements OnInit {
  @Input()
  title = '';

  constructor() {}

  ngOnInit(): void {}

  scrollToTop(): void {
    // TODO: implement
    // $element.parentElement.parentElement.parentElement.parentElement.scrollTo(0, 0);
  }
}
