import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { Router } from '@angular/router';

export interface IBreadCrumb {
  label: string;
  url: string;
}

export interface IContextButton {
  route?: string | string[];
  hover?: string;
  icon: BiosimulationsIcon;
  label: string;
  onClick?: (route: string, router: Router) => string | undefined;
}
