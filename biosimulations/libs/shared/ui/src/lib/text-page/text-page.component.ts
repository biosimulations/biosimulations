import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss'],
})
export class TextPageComponent implements OnInit {
  @Input()
  title = '';

  fixed = false;

  constructor() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    this.fixed = event.srcElement.scrollTop > 64;
  };
}
