import { ModelParameterDTO } from '../common/model-parameter.dto';
import { OntologyTermDTO } from '../common/ontology-term.dto';
import { FormatDTO } from '../common/format.dto';
import { ResourceDTO } from './resource.dto';

export class ModelDTO extends ResourceDTO {
  taxon: TaxonDTO;
  parameters: ModelParameterDTO;
  file: string;
  framework: OntologyTermDTO;
  format: FormatDTO;
}
