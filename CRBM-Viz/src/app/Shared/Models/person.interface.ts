export interface PersonInterface {
  firstName?: string;
  middleName?: string;
  lastName?: string;

  getFullName(): string;
}
