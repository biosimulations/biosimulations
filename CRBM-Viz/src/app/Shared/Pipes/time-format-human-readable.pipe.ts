import { Pipe, PipeTransform } from '@angular/core';
import { Simulation } from 'src/app/Shared/Models/simulation';

@Pipe({name: 'timeFormatHumanReadable'})
export class TimeFormatHumanReadablePipe implements PipeTransform {
  transform(value: number): string {
    return Simulation.getHumanReadableTime(value);
  }
}
