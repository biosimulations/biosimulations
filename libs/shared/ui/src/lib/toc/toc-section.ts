import { Observable } from 'rxjs';

export interface TocSection {
  heading: Observable<string>;
  target: HTMLElement;
}
