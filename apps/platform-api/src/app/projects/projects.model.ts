import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

interface Identifier {
  uri?: string;
  label: string;
}

interface DescribedIdentifier extends Identifier {
  uri?: string;
  label: string;
  attribute_uri?: string;
  attribute_label?: string;
}

interface FileMetadata {
  location: string;
  title?: string;
  abstract?: string;
  keywords: string[];
  thumbnails: string[];
  description?: string;
  taxa: Identifier[];
  encodes: Identifier[];
  sources: Identifier[];
  predecessors: Identifier[];
  successors: Identifier[];
  see_also: Identifier[];
  identifiers: Identifier[];
  citations: Identifier[];
  creators: Identifier[];
  contributors: Identifier[];
  license?: Identifier;
  funders: Identifier[];
  created?: string;
  modified: string[];
  other: DescribedIdentifier[];
}

type ArchiveMetadata = FileMetadata[];
export class PublishProjectInput {
  @ApiProperty({
    type: String,
    description:
      'A url pointing to a https://run.biosimulations.org SimulationRun in JSON Format',
    example: 'https://run.api.biosimulations.dev/run/60dcfd67241495e505262353',
  })
  @IsUrl()
  public simulationRun!: string;
}
export class BioModel extends PublishProjectInput {
  public id!: string;
  public constructor(id: string, simulationRun: string) {
    super();
    this.id = id;
    this.simulationRun = simulationRun;
  }
}
