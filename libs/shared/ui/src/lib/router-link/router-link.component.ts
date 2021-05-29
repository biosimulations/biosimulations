import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-router-link',
  templateUrl: './router-link.component.html',
  styleUrls: ['./router-link.component.sass'],
})
export class RouterLinkComponent {
  @Input() routerLink: string | (string | number)[] | undefined;
}
