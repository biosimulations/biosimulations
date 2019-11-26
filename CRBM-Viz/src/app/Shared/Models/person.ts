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

  getRoute(): (string | number)[] {
    return null;
  }

  getFullName(): string {
    return UtilsService.getPersonFullName(this);
  }

  getGravatarImgUrl(): string {
    return 'assets/defaultSilhouette.svg';
  }
}
