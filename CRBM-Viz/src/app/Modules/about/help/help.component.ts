import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent {
  constructor() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}
