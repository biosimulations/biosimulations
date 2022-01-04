import {
  CacheInterceptor,
  CacheTTL,
  CacheKey,
  CACHE_MANAGER,
  Inject,
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
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
import {
  OntologyTerm,
  OntologyIdsContainer,
  OntologyId,
  ErrorResponseDocument,
} from '@biosimulations/datamodel/api';
import { OntologyInfo } from '@biosimulations/datamodel/api';

@Controller('ontologies')
@ApiTags('Ontologies')
@UseInterceptors(CacheInterceptor)
@CacheTTL(60 * 24 * 7) // 1 week
export class OntologyApiController {
  public constructor(private service: OntologyApiService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private static version = 1;

  @Get()
  @ApiOperation({
    summary: 'Get the ontologies used by BioSimulations and BioSimulators',
    description:
      'Get a list of the ids of the ontologies used by BioSimulations and BioSimulators',
  })
  @ApiOkResponse({
    description:
      'The ids of the ontologies used by BioSimulations and BioSimulators were successfully retrieved',
    type: [String],
  })
  @CacheKey(`${OntologyApiController.version}`)
  public getList(): string[] {
    const ontologiesIds = new Set<string>();
    for (const [key, val] of Object.entries(Ontologies)) {
      ontologiesIds.add(key);
    }

    return [...ontologiesIds].sort();
  }

  @Get(':ontologyId/info')
  @CacheKey(`:ontologyId/info/${OntologyApiController.version}`)
  @ApiOperation({
    summary: 'Get information about an ontology',
    description:
      'Get information about an ontology, such as its identifiers, version, and source',
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
  public getOntologyInfo(
    @Param('ontologyId') ontologyId: Ontologies,
  ): OntologyInfo {
    const info = this.service.getOntologyInfo(ontologyId);
    if (!info) {
      throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
    }
    return info;
  }

  @Get(':ontologyId')
  @CacheKey(`:ontologyId/${OntologyApiController.version}`)
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
  public getOntologyTerms(
    @Param('ontologyId') ontologyId: Ontologies,
  ): OntologyTerm[] {
    const terms = this.service.getOntologyTerms(ontologyId);
    if (!terms) {
      throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
    }
    return terms;
  }

  @Get(':ontologyId/:termId')
  @CacheKey(`:ontologyId/:termId/${OntologyApiController.version}`)
  @ApiOperation({
    summary: 'Get a term in an ontology',
    description:
      'Get the name, description, IRI, and URL of a term in an ontology',
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
    description:
      'Id of the term (e.g., `KISAO_0000019` for the KiSAO ontology).',
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
  ): OntologyTerm {
    const term = this.service.getOntologyTerm(ontologyId, termId);
    if (!term) {
      throw new NotFoundException(
        `No '${ontologyId}' term with id '${termId}' exists`,
      );
    }
    return term;
  }

  @Post('terms')
  @ApiOperation({
    summary: 'Get information about multiple terms',
    description:
      'Get information about one or more terms in one or more ontologies',
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
    description:
      'Information about the requested terms was successfully retrieved',
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
    if (fields !== undefined) {
      if (!Array.isArray(fields)) {
        fields = [fields];
      }
    }

    const idsKey = ids.ids
      .map((id: OntologyId): string => {
        return `${id.namespace}:${id.id}`;
      })
      .sort()
      .join(',');
    const fieldsKey = fields ? fields.join(',') : '';
    const cacheKey = `${idsKey}:${fieldsKey}:${OntologyApiController.version}`;

    const cachedValue = await this.cacheManager.get(cacheKey) as Partial<OntologyTerm[]> | null;
    if (cachedValue) {
      return cachedValue;
    }

    const value = this.service.getTerms(ids.ids, fields);
    await this.cacheManager.set(cacheKey, value, { ttl: 0 });
    return value;
  }
}
