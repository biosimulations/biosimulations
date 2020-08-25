import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
// import { SimulatorData, SimulatorDataSource } from './simulators-datasource';
// import { SimulatorHttpService } from '../services/simulator-http.service';
import { of, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  // providers: [SimulatorDataSource],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent {
  // data: SimulatorData[] = [];

  constructor(
    // public dataSource: SimulatorDataSource,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
}
