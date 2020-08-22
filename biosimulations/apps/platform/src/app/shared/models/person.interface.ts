export interface PersonInterface {
  firstName: string;
  middleName: string | null;
  lastName: string;

  getRoute(): (string | number)[];
  getFullName(): string;
  getGravatarImgUrl(): string;
}
