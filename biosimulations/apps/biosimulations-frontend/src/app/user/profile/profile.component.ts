import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Shared/Services/auth0.service';
import { User } from '../../Shared/Models/user';
import { UserService } from '../../Shared/Services/user.service';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';

import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { ModelService } from '../../Shared/Services/Resources/model.service';
import { Model } from '../../Shared/Models/model';
import { Observable } from 'rxjs';
import { SimulationService } from '../../Shared/Services/Resources/simulation.service';
import { Visualization } from '../../Shared/Models/visualization';
import { VisualizationService } from '../../Shared/Services/Resources/visualization.service';
import { ProjectService } from '../../Shared/Services/Resources/project.service';
import { ChartTypeService } from '../../Shared/Services/Resources/chart-type.service';
import { Project } from '../../Shared/Models/project';
import { Simulation } from '../../Shared/Models/simulation';
import { ChartType } from '../../Shared/Models/chart-type';
import { NavItem } from '../../Shared/Enums/nav-item';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  /**
   * The object representing the user displayed in the profile
   */
  user: User;
  private loggedInUsername: string;
  projects: Observable<Project[]>;
  simulations: Observable<Simulation[]>;
  visualizations: Observable<Visualization[]>;
  chartTypes: Observable<ChartType[]>;
  models: Observable<Model[]>;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService,
    private modelService: ModelService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService,
    private projectService: ProjectService,
    private chartTypeService: ChartTypeService,
  ) {}

  /**
   * The init method subscribes to the user profile and the route. If a url parameter is provided, it pulls the username from
   * the user service. If not, it assumes the logged in profile's username. It then calls a method to create the view's breadcrumbs
   */

  // TODO rewrite this using proper rxjs
  ngOnInit() {
    this.auth.getUsername$().subscribe(name => {
      this.loggedInUsername = name;
      this.route.params.subscribe(routeParams => {
        let username;
        if (routeParams.username) {
          username = routeParams.username;
        } else {
          username = this.loggedInUsername;
        }
        this.userService.get$(username).subscribe(user => {
          this.user = user;
          this.user.modelService = this.modelService;
          this.user.simulationService = this.simulationService;
          this.user.visualizationService = this.visualizationService;
          this.user.chartTypeService = this.chartTypeService;
          this.user.projectService = this.projectService;
          this.models = this.user.getModels();
          this.projects = this.user.getProjects();
          this.simulations = this.user.getSimulations();
          this.visualizations = this.user.getVisualizations();
          this.chartTypes = this.user.getChartTypes();
        });

        this.setCrumbs(username === this.loggedInUsername);
      });
    });
  }

  /**
   * This method takes in a boolean and then constructs the appropriate crumbs. If the displayed profile is the users
   * profile, the breadcrumbs state "Your profile" and provide a link to edit the profile. If not, then the username of the
   *  profile is displayed. This method depends on the breadcrumbs service
   * @param isOwnProfile Whether the crumbs should reflect the user's own profile, or another users profile
   */
  setCrumbs(isOwnProfile: boolean) {
    const crumbs: object[] = [{ label: 'User', route: '/user' }];
    const buttons: NavItem[] = [];
    if (isOwnProfile) {
      crumbs.push({
        label: 'Your profile',
      });
      buttons.push({
        iconType: 'fas',
        icon: 'pencil-alt',
        label: 'Edit',
        route: ['/user/edit'],
        display: NavItemDisplayLevel.loggedIn,
      });
    } else {
      crumbs.push({
        label: this.user.userName,
      });
    }
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
