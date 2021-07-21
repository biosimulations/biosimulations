/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ApiProperty } from '@nestjs/swagger';
import {
  LabeledIdentifier as ILabeledIdentifier,
  DescribedIdentifier as IDescribedIdentifier,
  ArchiveMetadata as IArchiveMetadata,
} from '@biosimulations/datamodel/common';
import { IsUrl } from 'class-validator';

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

export class LabeledIdentifier implements ILabeledIdentifier {
  @ApiProperty()
  uri!: string | null;
  @ApiProperty()
  label!: string;
}

export class DescribedIdentifier
  extends LabeledIdentifier
  implements IDescribedIdentifier
{
  @ApiProperty()
  uri!: string | null;
  @ApiProperty()
  label!: string;
  @ApiProperty()
  attribute_uri?: string;
  @ApiProperty()
  attribute_label?: string;
}
type IArchiveMetadataType = Omit<IArchiveMetadata, 'created' | 'modified'> & {
  created: string;
  modified: string[];
};
export class ArchiveMetadata implements IArchiveMetadataType {
  @ApiProperty()
  uri!: string;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  abstract?: string;
  @ApiProperty()
  keywords: LabeledIdentifier[] = [];
  @ApiProperty()
  thumbnails: string[] = [];
  @ApiProperty()
  description?: string;
  @ApiProperty()
  taxa: LabeledIdentifier[] = [];
  @ApiProperty()
  encodes: LabeledIdentifier[] = [];
  @ApiProperty()
  sources: LabeledIdentifier[] = [];
  @ApiProperty()
  predecessors: LabeledIdentifier[] = [];
  @ApiProperty()
  successors: LabeledIdentifier[] = [];
  @ApiProperty()
  seeAlso: DescribedIdentifier[] = [];
  @ApiProperty()
  identifiers: LabeledIdentifier[] = [];
  @ApiProperty()
  citations: LabeledIdentifier[] = [];
  @ApiProperty()
  creators: LabeledIdentifier[] = [];
  @ApiProperty()
  contributors: LabeledIdentifier[] = [];
  @ApiProperty()
  license?: LabeledIdentifier;
  @ApiProperty()
  funders: LabeledIdentifier[] = [];
  @ApiProperty()
  created!: string;
  @ApiProperty()
  modified: string[] = [];
  @ApiProperty()
  other: DescribedIdentifier[] = [];
}
