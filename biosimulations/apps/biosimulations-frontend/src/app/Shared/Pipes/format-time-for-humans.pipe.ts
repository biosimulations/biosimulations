import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../Services/utils.service';

@Pipe({ name: 'formatTimeForHumans' })
export class FormatTimeForHumansPipe implements PipeTransform {
  constructor() {}

  transform(value: number): string {
    return UtilsService.formatTimeForHumans(value);
  }
}
