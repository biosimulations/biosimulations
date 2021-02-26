import { BiosimulationsIcon } from '@biosimulations/shared/icons';

export interface IBreadCrumb {
  label: string;
  url: string;
}

export interface IContextButton {
  route?: string | string[];
  hover?: string;
  icon: BiosimulationsIcon;
  label: string;
  onClick?: (route: string) => string | undefined;
}
