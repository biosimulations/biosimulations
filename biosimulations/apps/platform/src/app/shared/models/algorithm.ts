import { AlgorithmParameter } from './algorithm-parameter';
import {
  Algorithm as AlgorithmDTO,
  OntologyTerm as OntologyTermDTO,
  Citation as JournalReferenceDTO,
  Format as FormatDTO,
  AlgorithmParameter as AlgorithmParameterDTO,
} from '@biosimulations/datamodel/common';

import { OntologyTerm } from './ontology-term';
import { Format } from './format';
import { Citation } from './journal-reference';

export class Algorithm {
  id: string;
  name: string | null;
  kisaoId: string;
  ontologyTerms: OntologyTerm[];
  modelingFrameworks: OntologyTerm[];
  modelFormats: Format[];
  parameters: AlgorithmParameter[] | null;
  simulationFormats: Format[];
  archiveFormats: Format[];
  references: Citation[];

  // TODO Either remove from class or add to interface
  mimetype?: string;
  extension?: string;
  sedUrn?: string;

  constructor(data: AlgorithmDTO) {
    this.id = data.id;
    this.name = data.name;
    this.kisaoId = data.kisaoId;
    this.simulationFormats = data.simulationFormats.map(
      (value: FormatDTO) => new Format(value)
    );
    this.modelFormats = data.modelFormats.map(
      (value: FormatDTO) => new Format(value)
    );
    this.parameters = data.parameters.map(
      (value: AlgorithmParameterDTO) => new AlgorithmParameter(value)
    );
    this.archiveFormats = data.archiveFormats.map(
      (value: FormatDTO) => new Format(value)
    );
    this.references = data.references.map(
      (value: JournalReferenceDTO) => new Citation(value)
    );
    this.ontologyTerms = data.ontologyTerms.map(
      (value: OntologyTermDTO) => new OntologyTerm(value)
    );
    this.modelingFrameworks = data.modelingFrameworks.map(
      (value: OntologyTermDTO) => new OntologyTerm(value)
    );
  }
  serialize(): AlgorithmDTO {
    return {
      id: this.id,
      name: this.name,
      kisaoId: this.kisaoId,
      ontologyTerms: this.ontologyTerms.map((value: OntologyTerm) =>
        value.serialize()
      ),
      modelingFrameworks: this.modelingFrameworks.map((value: OntologyTerm) =>
        value.serialize()
      ),
      modelFormats: this.modelFormats.map((value: Format) => value.serialize()),

      parameters: this.parameters.map((value: AlgorithmParameter) =>
        value.serialize()
      ),
      simulationFormats: this.simulationFormats.map((value: Format) =>
        value.serialize()
      ),
      archiveFormats: this.archiveFormats.map((value: Format) =>
        value.serialize()
      ),
      references: this.references.map((value: Citation) => value.serialize()),
    };
  }

  getUrl(): string {
    return `http://www.biomodels.net/kisao/KISAO#KISAO_${this.id}`;
  }
}
