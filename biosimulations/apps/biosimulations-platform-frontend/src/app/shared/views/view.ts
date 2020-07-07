export abstract class View {
  abstract toString(): string;
  abstract icon(): string;
  abstract link(): string | null;
}
