import { ModelParameterDTO } from '../common/model-parameter.dto';
import { OntologyTermDTO } from '../common/ontology-term.dto';
import { ModelFormatDTO } from '../common/model-format.dto';
import { ResourceDTO } from './resource.dto';
import { ResourceType } from '../enums/resource-type';
import { TaxonDTO } from '../common/taxon.dto';
export class ModelDTO extends ResourceDTO {
  type = ResourceType.model;
  taxon: TaxonDTO;
  parameters: ModelParameterDTO;
  file: string;
  framework: OntologyTermDTO;
  format: ModelFormatDTO;
}
