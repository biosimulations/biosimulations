export interface PersonInterface {
  firstName?: string;
  middleName?: string;
  lastName?: string;

  getRoute(): (string | number)[];
  getFullName(): string;
  getGravatarImgUrl(): string;
}
