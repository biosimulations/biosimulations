import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'src/app/Shared/Services/utils.service';

@Pipe({name: 'formatTimeForHumans'})
export class FormatTimeForHumansPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) { }
  
  transform(value: number): string {
    return this.utilsService.formatTimeForHumans(value);
  }
}
