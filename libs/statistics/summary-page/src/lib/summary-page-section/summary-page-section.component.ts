import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-summary-page-section',
  templateUrl: './summary-page-section.component.html',
  styleUrls: ['./summary-page-section.component.scss'],
})
export class SummaryPageSectionComponent {
  @Input()
  public headingEnd!: string;
  @Input()
  public headingStart!: string;
  @Input()
  public statItems$!: Observable<any[]>;
  constructor() {}
}
