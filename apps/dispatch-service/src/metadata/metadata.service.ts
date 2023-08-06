import { Endpoints } from '@biosimulations/config/common';
import { OmexMetadataInputFormat } from '@biosimulations/datamodel/common';
import { ArchiveMetadataContainer, ArchiveMetadata, LabeledIdentifier } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  BioSimulationsCombineArchiveElementMetadata,
  BioSimulationsMetadataValue,
  BioSimulationsCustomMetadata,
} from '@biosimulations/combine-api-nest-client';
import { map, Observable, pluck, tap } from 'rxjs';

import { CombineWrapperService } from '../combineWrapper.service';

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);
  private endpoints: Endpoints;
  public constructor(private service: CombineWrapperService, private config: ConfigService) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public createMetadata(id: string): Observable<ArchiveMetadataContainer> {
    /* This must be external so that COMBINE archive can be downloaded by COMBINE API */
    const url = this.endpoints.getSimulationRunDownloadEndpoint(true, id);
    /* this.logger.debug(`Fetching metadata for archive for simulation run '${id}' at URL: ${url}`); */

    const postMetadata = this.service.getArchiveMetadata(OmexMetadataInputFormat.rdfxml, undefined, url).pipe(
      pluck('data'),
      tap((_) => {
        this.logger.log(`Extracted metadata for simulation run '${id}'.`);
      }),
      map((data: BioSimulationsCombineArchiveElementMetadata[]): ArchiveMetadata[] =>
        data.filter(this.filterMetadata, this).map(this.convertMetadata, this),
      ),
      tap((_) => this.logger.log(`Converted metadata for simulation run '${id}'.`)),
      map((data: ArchiveMetadata[]): ArchiveMetadataContainer => {
        return {
          metadata: data,
        };
      }),
    );

    return postMetadata;
  }

  private filterMetadata(metadata: BioSimulationsCombineArchiveElementMetadata): boolean {
    return (
      metadata?.combineArchiveUri !== null &&
      metadata?.combineArchiveUri !== undefined &&
      metadata?.combineArchiveUri !== ''
    );
  }
  private convertMetadataValue(data: BioSimulationsMetadataValue): LabeledIdentifier {
    if (data) {
      return {
        label: data.label || '',
        uri: data.uri,
      };
    }
    return { label: '', uri: '' };
  }

  private convertMetadata(combineMetadata: BioSimulationsCombineArchiveElementMetadata): ArchiveMetadata {
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
      encodes: combineMetadata.encodes?.map(this.convertMetadataValue, this) || [],
      sources: combineMetadata.sources?.map(this.convertMetadataValue, this) || [],
      predecessors: combineMetadata.predecessors?.map(this.convertMetadataValue, this) || [],
      successors: combineMetadata.successors?.map(this.convertMetadataValue, this) || [],
      seeAlso: combineMetadata.seeAlso?.map(this.convertMetadataValue, this) || [],
      references: combineMetadata.references?.map(this.convertMetadataValue, this) || [],
      identifiers: combineMetadata.identifiers?.map(this.convertMetadataValue, this) || [],
      citations: combineMetadata.citations?.map(this.convertMetadataValue, this) || [],
      creators: combineMetadata.creators?.map(this.convertMetadataValue, this) || [],
      funders: combineMetadata.funders?.map(this.convertMetadataValue, this) || [],
      contributors: combineMetadata.contributors?.map(this.convertMetadataValue, this) || [],
      license: combineMetadata.license ? [this.convertMetadataValue(combineMetadata.license)] : [],
      created: combineMetadata.created || undefined,
      modified: combineMetadata.modified || [],
      other:
        combineMetadata.other?.map((data: BioSimulationsCustomMetadata) => {
          return {
            uri: data.value.uri,
            label: data.value.label || null,
            attribute_label: data.attribute.label || null,
            attribute_uri: data.attribute.uri || null,
          };
        }, this) || [],
    };

    return metadata;
  }
}
