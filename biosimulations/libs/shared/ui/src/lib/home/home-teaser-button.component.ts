import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-teaser-button',
  templateUrl: './home-teaser-button.component.html',
  styleUrls: ['./home-teaser-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTeaserButtonComponent {
  @Input()
  label = '';

  @Input()
  routerLink!: any;

  @Input()
  disabled = false;
}
