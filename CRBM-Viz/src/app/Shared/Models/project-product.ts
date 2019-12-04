import { ProjectProductType } from '../Enums/project-product-type';
import { Identifier } from './identifier';
import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';

/* The product of a project, such as a figure, table, box, or supplementary item, and the resources that were used to create it.

Synonyms: artifact, output, display item
*/
export class ProjectProduct {
	type?: ProjectProductType;
	label?: string;
	description?: string;
	identifiers?: Identifier[] = [];	
	resources?: (Model | Simulation | Visualization)[] = [];
}
