import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html',
  styleUrls: ['./router-link.component.sass']
})
export class RouterLinkComponent {
  @Input() routerLink: string | number | (string | number)[];

  constructor() { }
}
