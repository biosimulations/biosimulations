import {
  DynamicModule,
  HttpService,
  HttpModule,
  Module,
  Global,
} from '@nestjs/common';
import { Configuration } from './configuration';

import { ACLSService } from './api/aCLS.service';
import { AttributeService } from './api/attribute.service';
import { DatasetService } from './api/dataset.service';
import { DatatypeService } from './api/datatype.service';
import { DomainService } from './api/domain.service';
import { GroupService } from './api/group.service';
import { LinkService } from './api/link.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [
    ACLSService,
    AttributeService,
    DatasetService,
    DatatypeService,
    DomainService,
    GroupService,
    LinkService,
  ],
  providers: [
    ACLSService,
    AttributeService,
    DatasetService,
    DatatypeService,
    DomainService,
    GroupService,
    LinkService,
  ],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration,
  ): DynamicModule {
    return {
      module: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(httpService: HttpService) {}
}
