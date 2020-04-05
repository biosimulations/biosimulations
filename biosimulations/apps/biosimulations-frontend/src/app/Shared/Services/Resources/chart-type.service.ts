import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { ChartType } from '../../Models/chart-type';
import { UserService } from '../user.service';
import { ChartTypeSerializer } from '../../Serializers/chart-type-serializer';

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
