import {
  Inject,
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Ontologies } from '@biosimulations/datamodel/common';
import { OntologyApiService } from './ontology-api.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OntologyTerm, OntologyIdsContainer, OntologyId, ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { OntologyInfo } from '@biosimulations/datamodel/api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('ontologies')
@ApiTags('Ontologies')
export class OntologyApiController {
  private static cacheTtl = 60 * 24 * 7; // 1 week
  private static version = 1;

  public constructor(private service: OntologyApiService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get()
  @ApiOperation({
    summary: 'Get the ontologies used by BioSimulations and BioSimulators',
    description: 'Get a list of the ids of the ontologies used by BioSimulations and BioSimulators',
  })
  @ApiOkResponse({
    description: 'The ids of the ontologies used by BioSimulations and BioSimulators were successfully retrieved',
    type: [String],
  })
  public async getList(): Promise<string[]> {
    const cacheKey = `${OntologyApiController.version}`;

    return this.getWithCache<string[]>(cacheKey, async (): Promise<string[]> => {
      const ontologiesIds = new Set<string>();
      for (const [key, _val] of Object.entries(Ontologies)) {
        ontologiesIds.add(key);
      }
      return [...ontologiesIds].sort();
    });
  }

  @Get(':ontologyId/info')
  @ApiOperation({
    summary: 'Get information about an ontology',
    description: 'Get information about an ontology, such as its identifiers, version, and source',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({
    description: 'Information about the ontology was successfully retrieved',
    type: OntologyInfo,
  })
  @ApiNotFoundResponse({
    description: 'No ontology has the requested id',
    type: ErrorResponseDocument,
  })
  public async getOntologyInfo(@Param('ontologyId') ontologyId: Ontologies): Promise<OntologyInfo> {
    const cacheKey = `${ontologyId}/info/${OntologyApiController.version}`;

    return this.getWithCache<OntologyInfo>(cacheKey, async (): Promise<OntologyInfo> => {
      const info = this.service.getOntologyInfo(ontologyId);
      if (!info) {
        throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
      }
      return info;
    });
  }

  @Get(':ontologyId')
  @ApiOperation({
    summary: 'Get the terms in an ontology',
    description: 'Get a list of the terms in an ontology',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({
    description: 'The terms of the ontology were successfully retrieved',
    type: [OntologyTerm],
  })
  @ApiNotFoundResponse({
    description: 'No ontology has the requested id',
    type: ErrorResponseDocument,
  })
  public getOntologyTerms(@Param('ontologyId') ontologyId: Ontologies): Promise<OntologyTerm[]> {
    const cacheKey = `${ontologyId}/${OntologyApiController.version}`;

    return this.getWithCache<OntologyTerm[]>(cacheKey, async (): Promise<OntologyTerm[]> => {
      const terms = this.service.getOntologyTerms(ontologyId);
      if (!terms) {
        throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
      }
      return terms;
    });
  }

  @Get(':ontologyId/:termId')
  @ApiOperation({
    summary: 'Get a term in an ontology',
    description: 'Get the name, description, IRI, and URL of a term in an ontology',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiParam({
    name: 'termId',
    description: 'Id of the term (e.g., `KISAO_0000019` for the KiSAO ontology).',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Information about the term was successfully retrieved',
    type: OntologyTerm,
  })
  @ApiNotFoundResponse({
    description: 'No term has the requested ontology and term ids',
    type: ErrorResponseDocument,
  })
  public getOntologyTerm(
    @Param('ontologyId') ontologyId: Ontologies,
    @Param('termId') termId: string,
  ): Promise<OntologyTerm> {
    const cacheKey = `${ontologyId}/${termId}/${OntologyApiController.version}`;

    return this.getWithCache<OntologyTerm>(cacheKey, async (): Promise<OntologyTerm> => {
      const term = this.service.getOntologyTerm(ontologyId, termId);
      if (!term) {
        throw new NotFoundException(`No '${ontologyId}' term with id '${termId}' exists`);
      }
      return term;
    });
  }

  @Post('terms')
  @ApiOperation({
    summary: 'Get information about multiple terms',
    description: 'Get information about one or more terms in one or more ontologies',
  })
  @ApiQuery({
    name: 'fields',
    description: 'Which fields to return. Default: return all fields',
    required: false,
    type: [String],
    example: ['name'],
  })
  @ApiBody({
    description: 'List of terms (ontology and id) to obtain information about.',
    required: true,
    type: OntologyIdsContainer,
  })
  @ApiOkResponse({
    description: 'Information about the requested terms was successfully retrieved',
    type: [OntologyTerm],
  })
  @ApiNotFoundResponse({
    description: 'One or more of the requested terms is not valid',
    type: ErrorResponseDocument,
  })
  @HttpCode(HttpStatus.OK)
  public async getTerms(
    @Body() ids: OntologyIdsContainer,
    @Query('fields') fields?: string | string[],
  ): Promise<Partial<OntologyTerm[]>> {
    let fieldsArr: string[] | undefined;
    if (fields === undefined) {
      fieldsArr = undefined;
    } else {
      if (Array.isArray(fields)) {
        fieldsArr = fields;
      } else {
        fieldsArr = [fields];
      }
    }

    const idsKey = ids.ids
      .map((id: OntologyId): string => {
        return `${id.namespace}:${id.id}`;
      })
      .sort()
      .join(',');
    const fieldsKey = fieldsArr ? fieldsArr.join(',') : '';
    const cacheKey = `${idsKey}:${fieldsKey}:${OntologyApiController.version}`;

    return this.getWithCache<Partial<OntologyTerm[]>>(cacheKey, async (): Promise<Partial<OntologyTerm[]>> => {
      return this.service.getTerms(ids.ids, fieldsArr);
    });
  }

  private async getWithCache<T>(key: string, valueFunc: () => Promise<T>): Promise<T> {
    const cachedValue = (await this.cacheManager.get(key)) as T | null;

    if (cachedValue != null) {
      return cachedValue;
    } else {
      const value = await valueFunc();
      await this.cacheManager.set(key, value, OntologyApiController.cacheTtl);
      return value;
    }
  }
}
