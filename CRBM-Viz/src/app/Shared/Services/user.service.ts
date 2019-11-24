import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/user';
import { ModelService } from './model.service';
import { SimulationService } from './simulation.service';
import { VisualizationsService } from './visualizations.service';

// tslint:disable:max-line-length

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private modelService: ModelService;
  private simulationService: SimulationService;
  private visualizationsService: VisualizationsService;
  private endpoint = 'https://crbm.auth0.com/userinfo';

  constructor(
    private http: HttpClient,
    private injector: Injector
    ) {}

  static _get(username?: string): User {
    let user:User;
    switch (username) {
      default:
      case 'jonrkarr':
        user = new User(
          'github|2848297',
          1,
          username,
          'Jonathan',
          'R',
          'Karr',
          'Icahn School of Medicine at Mount Sinai',
          'https://www.karrlab.org',
          'jonrkarr@gmail.com',
          true,
          true,
          'jonrkarr@gmail.com',
          'jonrkarr',
          'Yb5nVLAAAAAJ',
          '0000-0002-2605-5080',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla risus ac aliquam commodo. Ut pellentesque, ' +
            'ligula sit amet condimentum lacinia, sapien tortor malesuada justo, et finibus nulla tellus vel velit. Aliquam erat volutpat. ' +
            'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras a scelerisque urna. ' +
            'Sed sodales ex vel sapien condimentum, at rhoncus nisi mollis. Sed blandit lobortis sagittis. Ut pretium quam odio, ' +
            'nec dictum erat aliquet quis.',
          [
            ModelService._get('001'),
            ModelService._get('003'),
            ModelService._get('006'),
            ModelService._get('001'),
            ModelService._get('003'),
            ],
          [
            SimulationService._get('001'),
            SimulationService._get('003'),
            SimulationService._get('006'),
            SimulationService._get('001'),
          ],
          [],
        );
        break;
      case 'y.skaf':
        user = new User(null, 2, 'y.skaf', 'Yara', null, 'Skaf',
          'University of Connecticut Health Center',
          null,
          'skaf@uchc.edu',
          true,
          true,
          'skaf@uchc.edu',
          null,
          null,
          null,
          'Description');
        break;
      case 'b.shaikh':
        user = new User(null, 3, 'b.bhaikh', 'Bilal', null, 'Shaikh',
          'Icahn School of Medicine at Mount Sinai',
          'https://bilalshaikh.com',
          'bilal.shaikh@columbia.edu',
          true,
          true,
          null,
          'bilalshaikh42',
          null,
          null,
          'Description');
        break;
      case 's.edelstein':
        user = new User(null, 4, 's.edelstein', 'S', null, 'Edelstein');
        break;
      case 'a.goldbeter':
        user = new User(null, 5, 'a.goldbeter', 'A', null, 'Goldbeter');
        break;
      case 'j.tyson':
        user = new User(null, 6, 'j.tyson', 'J', null, 'Tyson');
        break;
    }
    return user;
  }

  private getServices(): void {
    if (this.modelService == null) {
      this.modelService = this.injector.get(ModelService);
      this.simulationService = this.injector.get(SimulationService);
      this.visualizationsService = this.injector.get(VisualizationsService);
    }
  }

  getUser(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer W0p9s-oFubPuONgWER3JGAqnZ-HkEurI',
      }),
    };
    const Httpheaders = new HttpHeaders({
      Authorization: 'Bearer SY1MOMZZVnEBtzEG7aw-y-JYDEwm-QM3',
    });
    return this.http.get(this.endpoint, { headers: Httpheaders });
  }

  get(username?: string) : User {
    this.getServices();
    return UserService._get(username);
  }

  getByAuth0Id(id: string): User {
    let user:User;
    switch (id) {
      case 'github|2848297':
        user = this.get('jonrkarr');
        break;
      default:
        user = new User(id);
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
}
