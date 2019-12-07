import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/user';
import { ModelService } from './model.service';
import { SimulationService } from './simulation.service';
import { VisualizationService } from './visualization.service';
import { AuthService } from './auth0.service';
import { environment } from 'src/environments/environment';

// tslint:disable:max-line-length

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector
  ) { }
  private modelService: ModelService;
  private simulationService: SimulationService;
  private visualizationService: VisualizationService;
  private endpoint = environment.crbm.CRBMAPI_URL

  static _get(username?: string, includeRelObj = false): User {
    let user: User;
    switch (username) {
      default:
      case 'jonrkarr':
        user = new User();
        user.auth0Id = 'github|2848297';
        user.id = 1;
        user.username = username;
        user.firstName = 'Jonathan';
        user.middleName = 'R';
        user.lastName = 'Karr';
        user.organization = 'Icahn School of Medicine at Mount Sinai';
        user.website = 'https://www.karrlab.org';
        user.email = 'jonrkarr@gmail.com';
        user.emailVerified = true;
        user.emailPublic = true;
        user.gravatarEmail = 'jonrkarr@gmail.com';
        user.gitHubId = 'jonrkarr';
        user.googleScholarId = 'Yb5nVLAAAAAJ';
        user.orcId = '0000-0002-2605-5080';
        user.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla risus ac aliquam commodo. Ut pellentesque, ' +
          'ligula sit amet condimentum lacinia, sapien tortor malesuada justo, et finibus nulla tellus vel velit. Aliquam erat volutpat. ' +
          'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras a scelerisque urna. ' +
          'Sed sodales ex vel sapien condimentum, at rhoncus nisi mollis. Sed blandit lobortis sagittis. Ut pretium quam odio, ' +
          'nec dictum erat aliquet quis.';
        if (includeRelObj) {
          user.models = [
            ModelService._get('001'),
            ModelService._get('003'),
            ModelService._get('006'),
            ModelService._get('001'),
            ModelService._get('003'),
          ];
          user.simulations = [
            SimulationService._get('001'),
            SimulationService._get('003'),
            SimulationService._get('006'),
            SimulationService._get('001'),
          ];
          user.visualizations = [];
        }
        break;
      case 'y.skaf':
        user = new User();
        user.id = 2;
        user.username = 'y.skaf';
        user.firstName = 'Yara';
        user.lastName = 'Skaf';
        user.organization = 'University of Connecticut Health Center';
        user.email = 'skaf@uchc.edu';
        user.emailVerified = true;
        user.emailPublic = true;
        user.gravatarEmail = 'skaf@uchc.edu';
        user.description = 'Description';
        break;
      case 'b.shaikh':
        user = new User();
        user.id = 3;
        user.username = 'b.bhaikh';
        user.firstName = 'Bilal';
        user.lastName = 'Shaikh';
        user.organization = 'Icahn School of Medicine at Mount Sinai';
        user.website = 'https://bilalshaikh.com';
        user.email = 'bilal.shaikh@columbia.edu';
        user.emailVerified = true;
        user.emailPublic = true;
        user.gitHubId = 'bilalshaikh42';
        user.description = 'Description';
        break;
      case 's.edelstein':
        user = new User();
        user.id = 4;
        user.username = 's.edelstein';
        user.firstName = 'S';
        user.lastName = 'Edelstein';
        break;
      case 'a.goldbeter':
        user = new User();
        user.id = 5;
        user.username = 'a.goldbeter';
        user.firstName = 'A';
        user.lastName = 'Goldbeter';
        break;
      case 'j.tyson':
        user = new User();
        user.id = 6;
        user.username = 'j.tyson';
        user.firstName = 'J';
        user.lastName = 'Tyson';
        break;
    }
    return user;
  }
  getUser$(): Observable<User> {
    let user: Observable<User>
    this.auth.userProfile$.subscribe((profile) => (
      user = this.http.get<User>(this.endpoint + '/user/' + profile.nickname)));

    return user;

  }

  private getServices(): void {
    if (this.modelService == null) {
      this.modelService = this.injector.get(ModelService);
      this.simulationService = this.injector.get(SimulationService);
      this.visualizationService = this.injector.get(VisualizationService);
    }
  }



  get(username?: string): User {
    this.getServices();
    return UserService._get(username, true);
  }

  getByAuth0Id(auth0Id: string): User {
    let user: User;
    switch (auth0Id) {
      case 'github|2848297':
        user = this.get('jonrkarr');
        break;
      default:
        user = new User();
        user.auth0Id = auth0Id;
        break;
    }
    return user;
  }

  list(): User[] {
    return [
      this.get('jonrkarr'),
      this.get('y.skaf'),
      this.get('b.shaikh'),
      this.get('s.edelstein'),
      this.get('a.goldbeter'),
      this.get('j.tyson'),
    ];
  }

  set(user: User): void {

  }
}
