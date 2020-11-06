import { PersonInterface } from './person.interface';
import { UtilsService } from '../Services/utils.service';
import { Person as PersonDTO } from '@biosimulations/datamodel/common';

export class Person implements PersonInterface {
  firstName: string;
  middleName: string | null;
  lastName: string;

  constructor(person: PersonDTO) {
    this.firstName = person.firstName;
    this.middleName = person.middleName;
    this.lastName = person.lastName;
  }
  serialize(): PersonDTO {
    return {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
    };
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
