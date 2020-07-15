import { biosimulationsIcon } from '@biosimulations/ui/icons';

export abstract class ViewModel {
  abstract toString(): string;
  abstract icon(): biosimulationsIcon | null;
  abstract link(): string | null;
  abstract match(predicate: any): boolean;
}
