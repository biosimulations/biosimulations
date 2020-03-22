import { ProjectProductType } from '../Enums/project-product-type';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import { ChartType } from './chart-type';
import { Observable } from 'rxjs';

/* The product of a project, such as a figure, table, box, or supplementary item, and the resources that were used to create it.

Synonyms: artifact, output, display item
*/
export class ProjectProduct {
  ref?: JournalReference;
  type?: ProjectProductType;
  label?: string;
  description?: string;
  resourceIds? = [];
  resources?: (
    | Observable<Model>
    | Observable<Simulation>
    | Observable<Visualization>
    | Observable<ChartType>
  )[] = [];
}
