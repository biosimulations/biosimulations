import { DateString } from '../aliases/formats';

export class LogItemDTO {
  time: DateString;
  type: string;
  message: string;
}
