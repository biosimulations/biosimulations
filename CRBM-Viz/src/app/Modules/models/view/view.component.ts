import { Component, OnInit, Inject } from '@angular/core';
import { Model } from 'src/app/Shared/Models/model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  id: string;
  model: Model;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.getData();
      }
    });

    const crumbs: object[] = [
      {label: 'Models', route: '/models'},
      {label: 'Model ' + this.id},
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'mat',
        icon: 'view_list',
        label: 'Browse',
        route: ['/models'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'mat',
        icon: 'add',
        label: 'New',
        route: ['/models/new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'mat',
        icon: 'hourglass_empty',
        label: 'Your models',
        route: ['/user/models'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
  }

  getData() {
    this.model = this.modelService.get(this.id);
  }

  download(): void {
    const url = this.model.getFileUrl();
    const link = document.createElement('a');
    link.download = `model-${ this.id }.xml`;
    link.href = url;
    link.click();
  }
}
