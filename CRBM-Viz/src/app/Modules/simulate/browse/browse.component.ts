import { Component, Inject } from '@angular/core';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent {
  constructor(@Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService) {}

  ngOnInit() {
    const crumbs: Object[] = [
      {label: 'Simulate'},
    ];
    const buttons: Object[] = [      
      {iconType: 'mat', icon: 'add', label: 'Submit', route: ['/simulate/new']},
      {iconType: 'mat', icon: 'hourglass_empty', label: 'Status', route: ['/simulate/status']},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
