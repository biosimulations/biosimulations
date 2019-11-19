import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'src/app/Shared/Services/utils.service';

@Pipe({name: 'formatTimeForHumans'})
export class FormatTimeForHumansPipe implements PipeTransform {
  constructor() { }
  
  transform(value: number): string {
    return new UtilsService().formatTimeForHumans(value);
  }
}
