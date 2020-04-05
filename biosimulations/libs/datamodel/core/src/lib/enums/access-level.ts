export enum AccessLevel {
  private = 'private',
  public = 'public',
  shared = 'shared',
}
export const accessLevels = [
  { value: AccessLevel.private, name: 'private' },
  { value: AccessLevel.public, name: 'public' },
  { value: AccessLevel.shared, name: 'shared' },
];
