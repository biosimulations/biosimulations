import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '@biosimulations/datamodel/core';
import { License } from 'src/app/Shared/Enums/license';
import { ChartType } from 'src/app/Shared/Models/chart-type';
import { Identifier } from 'src/app/Shared/Models/identifier';
import { JournalReference } from 'src/app/Shared/Models/journal-reference';
import { Person } from 'src/app/Shared/Models/person';
import { RemoteFile } from 'src/app/Shared/Models/remote-file';
import { UserService } from 'src/app/Shared/Services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { Serializer } from 'src/app/Shared/Serializers/serializer';
import { ChartTypeSerializer } from 'src/app/Shared/Serializers/chart-type-serializer';

@Injectable({
  providedIn: 'root',
})
export class ChartTypeService extends ResourceService<ChartType> {
  private userService: UserService;

  constructor(private http: HttpClient, private injector: Injector) {
    super(http, 'charts', new ChartTypeSerializer());
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item =>
        item['name'].toLowerCase().includes(lowCaseName),
      );
    } else {
      return list;
    }
  }
}
