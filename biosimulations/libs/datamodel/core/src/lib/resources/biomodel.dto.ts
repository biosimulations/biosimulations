import { BiomodelParameterDTO } from '../common/biomodel-parameter.dto';
import { BiomodelVariableDTO } from '../common/biomodel-variable.dto';
import { OntologyTermDTO } from '../common/ontology-term.dto';
import { ModelFormatDTO } from '../common/model-format.dto';
import { ResourceDTO } from './resource.dto';
import { ResourceType } from '../enums/resource-type';
import { TaxonDTO } from '../common/taxon.dto';
export class BiomodelDTO extends ResourceDTO {
  type = ResourceType.model;
  taxon: TaxonDTO;
  parameters: BiomodelParameterDTO;
  variables: BiomodelVariableDTO;
  file: string;
  framework: OntologyTermDTO;
  format: ModelFormatDTO;
}
