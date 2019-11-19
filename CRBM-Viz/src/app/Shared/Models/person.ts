import { PersonInterface } from './person.interface';
import { UtilsService } from '../Services/utils.service';

export class Person implements PersonInterface {
  firstName?: string;
  middleName?: string;
  lastName?: string;
    
  constructor (firstName?: string, middleName?: string, lastName?: string) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }

  getFullName(): string {
    return UtilsService.getPersonFullName(this);
  }
}
