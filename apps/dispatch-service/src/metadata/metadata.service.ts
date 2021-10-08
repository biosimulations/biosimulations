import { Endpoints } from '@biosimulations/config/common';
import { OmexMetadataInputFormat } from '@biosimulations/datamodel/common';
import {
  SimulationRunMetadataInput,
  ArchiveMetadata,
  LabeledIdentifier,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

import {
  BioSimulationsCombineArchiveElementMetadata,
  BioSimulationsMetadataValue,
  BioSimulationsCustomMetadata,
} from '@biosimulations/combine-api-client';
import { firstValueFrom } from 'rxjs';

import { CombineWrapperService } from '../combineWrapper.service';
import { SimulationRunService } from '@biosimulations/backend-api-client';
@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);
  private endpoints: Endpoints;
  public constructor(
    private service: CombineWrapperService,
    private config: ConfigService,
    private submit: SimulationRunService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async createMetadata(id: string, isPublic: boolean): Promise<void> {
    const url = this.endpoints.getRunDownloadEndpoint(id, true);
    this.logger.debug(`Fetching metadata for archive at url: ${url}`);

    const res = await firstValueFrom(
      this.service.getArchiveMetadata(
        OmexMetadataInputFormat.rdfxml,
        undefined,
        url,
      ),
    );

    // TODO handle errors/timeouts

    const combineMetadata: BioSimulationsCombineArchiveElementMetadata[] =
      res.data;

    this.logger.log(`Extracted metadata for ${id}`);
    //this.logger.error(JSON.stringify(combineMetadata))

    const metadata: ArchiveMetadata[] = combineMetadata.map(
      this.convertMetadata,
      this,
    );
    this.logger.log(`Converted metadata for ${id}`);
    const postMetadata: SimulationRunMetadataInput = {
      id: id,
      metadata,
      isPublic,
    };

    const metadataReq = this.submit.postMetadata(postMetadata);

    const metadataPostObserver = {
      next: (res: SimulationRunMetadata) => {
        this.logger.log(`Posted metadata for ${id}`);
      },
      error: (err: AxiosError) => {
        this.logger.error(`Failed to post metadata for ${id}`);
        this.logger.error(err?.response?.data);
        // Its important to throw this error so that the calling service is aware posting metadata failed
        throw err;
      },
    };
    metadataReq.subscribe(metadataPostObserver);
  }

  private convertMetadataValue(
    data: BioSimulationsMetadataValue,
  ): LabeledIdentifier {
    if (data) {
      return {
        label: data.label || '',
        uri: data.uri,
      };
    }
    return { label: '', uri: '' };
  }

  private convertMetadata(
    combineMetadata: BioSimulationsCombineArchiveElementMetadata,
  ): ArchiveMetadata {
    const metadata: ArchiveMetadata = {
      uri: combineMetadata.uri,
      title: combineMetadata.title,
      abstract: combineMetadata.abstract,
      keywords:
        combineMetadata.keywords?.map((keyword) => {
          return { label: keyword, uri: null };
        }) || [],
      thumbnails: combineMetadata.thumbnails || [],
      description: combineMetadata.description,
      taxa: combineMetadata.taxa?.map(this.convertMetadataValue, this) || [],
      encodes:
        combineMetadata.encodes?.map(this.convertMetadataValue, this) || [],
      sources:
        combineMetadata.sources?.map(this.convertMetadataValue, this) || [],
      predecessors:
        combineMetadata.predecessors?.map(this.convertMetadataValue, this) ||
        [],
      successors:
        combineMetadata.successors?.map(this.convertMetadataValue, this) || [],
      seeAlso:
        combineMetadata.seeAlso?.map(this.convertMetadataValue, this) || [],
      identifiers:
        combineMetadata.identifiers?.map(this.convertMetadataValue, this) || [],
      citations:
        combineMetadata.citations?.map(this.convertMetadataValue, this) || [],
      creators:
        combineMetadata.creators?.map(this.convertMetadataValue, this) || [],
      funders:
        combineMetadata.funders?.map(this.convertMetadataValue, this) || [],
      contributors:
        combineMetadata.contributors?.map(this.convertMetadataValue, this) ||
        [],
      license: [this.convertMetadataValue(combineMetadata.license)],
      created: combineMetadata.created || '',
      modified: combineMetadata.modified || [],
      other:
        combineMetadata.other?.map((data: BioSimulationsCustomMetadata) => {
          return {
            uri: data.value.uri,
            label: data.value.label || null,
            attribute_label: data.attribute.label,
            attribute_uri: data.attribute.uri,
          };
        }, this) || [],
    };

    return metadata;
  }
}
