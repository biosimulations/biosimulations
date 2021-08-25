import {
  BioSimulationsCombineArchiveElementMetadata,
  BioSimulationsCustomMetadata,
  BioSimulationsMetadataValue,
  COMBINEService,
} from '@biosimulations/combine-api-client';
import {
  extractMetadataJob,
  JobQueue,
} from '@biosimulations/messages/messages';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ArchiveMetadata,
  LabeledIdentifier,
  SimulationRunMetadataInput,
} from '@biosimulations/datamodel/api';
import { AxiosError } from 'axios';
@Processor(JobQueue.metadata)
export class MetadataProcessor {
  private readonly logger = new Logger(MetadataProcessor.name);
  public constructor(
    private service: COMBINEService,
    private httpService: HttpService,
  ) {}

  @Process()
  private async extractMetadata(job: Job<extractMetadataJob>): Promise<void> {
    const id = job.data.simId;

    // TODO Remove hardcoded URLS
    const url = `https://run.api.biosimulations.dev/runs/${id}/download`;
    //const metadataURL= 'https://run.api.biosimulations.dev/metadata/';
    const metadataURL= 'http://localhost:3333/metadata'

    const res = await firstValueFrom(
      this.service.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
        undefined,
        url,
      ),
    );

    // TODO handle errors/timeouts

    const combineMetadata: BioSimulationsCombineArchiveElementMetadata[] =
      res.data;

    this.logger.log(`Extracted metadata for ${id}`);
    //this.logger.error(JSON.stringify(combineMetadata))
    job.progress(50);

    const metadata: ArchiveMetadata[] = combineMetadata.map(
      this.convertMetadata,
      this
    );
    this.logger.log(`Converted metadata for ${id}`);
    const postMetadata: SimulationRunMetadataInput = {
      id: id,
      metadata,
    };
    
    const postedMetadata = this.httpService.post(metadataURL, postMetadata).subscribe(
      (res) => {
    
        if (res.status !== 201) {
          this.logger.error(`Failed to post metadata for ${id}`);
        }
        if (res.status === 201) {
          this.logger.log(`Posted metadata for ${id}`);
        }
        this.logger.debug(postedMetadata)
        job.progress(100);
        
      },
      (err :AxiosError) => {
        this.logger.error(`Failed to post metadata for ${id}`);
        this.logger.error(err?.response?.data);
      }
    );
  }

  private convertMetadataValue(
    data: BioSimulationsMetadataValue,
  ): LabeledIdentifier {
    this.logger.log(`convert element value for ${JSON.stringify(data)}`);
    if (data) {
      return {
        label: data.label || '',
        uri: data.uri,
      };
    }
    return {label: '', uri: ''};
  }

  private convertMetadata(
    combineMetadata: BioSimulationsCombineArchiveElementMetadata,
  ): ArchiveMetadata {
  
    this.logger.log(`to convert metadata for ${JSON.stringify(combineMetadata)}`);
    
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
      predecessors:
        combineMetadata.predecessors?.map(this.convertMetadataValue, this) || [],
      successors:
        combineMetadata.successors?.map(this.convertMetadataValue, this) || [],
      seeAlso: combineMetadata.seeAlso?.map(this.convertMetadataValue,this) || [],
      identifiers:
        combineMetadata.identifiers?.map(this.convertMetadataValue,this) || [],
      citations:
        combineMetadata.citations?.map(this.convertMetadataValue,this) || [],
      creators: combineMetadata.creators?.map(this.convertMetadataValue, this) || [],
      funders: combineMetadata.funders?.map(this.convertMetadataValue, this) || [],
      contributors:
        combineMetadata.contributors?.map(this.convertMetadataValue, this) || [],
      license: this.convertMetadataValue(combineMetadata.license),
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
