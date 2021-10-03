import { Endpoints } from '@biosimulations/config/common';
import {
  SimulationRunMetadataInput,
  ArchiveMetadata,
  LabeledIdentifier,
} from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';

import {
  BioSimulationsCombineArchiveElementMetadata,
  BioSimulationsMetadataValue,
  BioSimulationsCustomMetadata,
} from '@biosimulations/combine-api-client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CombineWrapperService } from '../combineWrapper.service';
@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);
  private endpoints: Endpoints;
  public constructor(
    private service: CombineWrapperService,
    private httpService: HttpService,
    private config: ConfigService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async createMetadata(id: string, isPublic: boolean): Promise<void> {
    const metadataURL = this.endpoints.getMetadataEndpoint();

    const url = this.endpoints.getRunDownloadEndpoint(id, true);
    this.logger.debug(`Fetching metadata for archive at url: ${url}`);
    this.logger.debug(`Using metadata endpoint at ${metadataURL}`);
    const res = await firstValueFrom(
      this.service.getArchiveMetadata(undefined, url),
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
    const metadataPostObserver = {
      next: (res: AxiosResponse<any>) => {
        if (res.status === 201) {
          this.logger.log(`Posted metadata for ${id}`);
        }
      },
      error: (err: AxiosError) => {
        this.logger.error(`Failed to post metadata for ${id}`);
        this.logger.error(err?.response?.data);
        throw err;
      },
    };
    const postedMetadata = this.httpService
      .post(metadataURL, postMetadata)
      .subscribe(metadataPostObserver);
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
