import { ProjectProductType } from '../Enums/project-product-type';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';

/* The product of a project, such as a figure, table, box, or supplementary item, and the resources that were used to create it.

Synonyms: artifact, output, display item
*/
export class ProjectProduct {
	ref?: JournalReference;
	type?: ProjectProductType;
	label?: string;
	description?: string;
	resources?: (Model | Simulation | Visualization)[] = [];
}
