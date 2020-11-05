import { ProjectProductType } from '@biosimulations/datamodel/common';
import { Citation } from './journal-reference';
import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import { ChartType } from './chart-type';
import { Observable } from 'rxjs';
import { ProjectProduct as ProjectProductDTO } from '@biosimulations/datamodel/common';

/* The product of a project, such as a figure, table, box, or supplementary item, and the resources that were used to create it.

Synonyms: artifact, output, display item
*/
export class ProjectProduct {
  ref?: Citation;
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
  serialize(): ProjectProductDTO {
    return {
      reference: this.ref.serialize(),
      type: this.type,
      label: this.label,
      description: this.description,
      resources: this.resourceIds,
    };
  }
}
