import {
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';

interface TocItem {
  title: string;
  target: HTMLElement;
}

@Component({
  selector: 'biosimulations-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss'],
})
export class TextPageComponent implements OnInit {
  @Input()
  title = '';

  fixed = false;

  tocSections: TocItem[] = [];

  /* TODO (low priority): switch to monitoring ContentChildren so that the TOC is dynamically updated with the section or their titles change.
       low priority because none of the instances of TextPageComponent currently need this.
  */
  @ViewChild('sectionsContainer')
  set sectionsContainer(container: any) {
    this.getTocSections(container.nativeElement);
  }

  getTocSections(container: any) {
    for (const section of container.children) {
      const title = section.getAttribute('shortTitle') || section.getAttribute('title');
      if (title) {
        this.tocSections.push({
          title: title,
          target: section,
        });
      } else {
        this.getTocSections(section);
      }
    }
  }

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
