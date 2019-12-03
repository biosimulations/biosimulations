import { Component, OnInit, Inject } from '@angular/core';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
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
  getLicenseInfo = getLicenseInfo;

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

      this.getData();

      const crumbs: object[] = [
        {label: 'Models', route: '/models'},
        {label: 'Model ' + this.id},
      ];
      const buttons: NavItem[] = [
        {
          iconType: 'mat',
          icon: 'timeline',
          label: 'Simulate',
          route: ['/simulations', 'new', this.id],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'pencil-alt',
          label: 'Edit',
          route: ['/models', this.id, 'edit'],
          display: (this.model.access === AccessLevel.public ? NavItemDisplayLevel.never : NavItemDisplayLevel.user),
          displayUser: this.model.owner,
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          route: ['/models', this.id, 'delete'],
          display: (this.model.access === AccessLevel.public ? NavItemDisplayLevel.never : NavItemDisplayLevel.user),
          displayUser: this.model.owner,
        },      
        {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/models', 'new'],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your models',
          route: ['/user', 'models'],
          display: NavItemDisplayLevel.loggedIn,
        },
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/models'],
          display: NavItemDisplayLevel.always,
        },
      ];
      this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
    });
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
