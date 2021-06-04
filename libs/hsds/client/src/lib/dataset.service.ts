import { Inject, Injectable } from '@nestjs/common';
import {
  AttributeService,
  DatasetService,
  DomainService,
  GroupService,
  InlineResponse2003,
  InlineResponse2004Links,
  LinkService,
} from '@biosimulations/hdf5apiclient';

const ACCEPT = 'application/json';
Injectable();
export class SimulationHDFService {
  public constructor(
    @Inject(DatasetService) private datasetService: DatasetService,
    @Inject(DomainService) private domainService: DomainService,
    @Inject(GroupService) private groupService: GroupService,
    @Inject(AttributeService) private attrbuteService: AttributeService,
    @Inject(LinkService) private linkService: LinkService,
  ) {}

  private async getLinks(groupId: string, domain: string) {
    const linksResponse = await this.linkService
      .groupsIdLinksGet(groupId, ACCEPT, domain)
      .toPromise();
    return linksResponse.data.links;
  }

  private async getRootGroupId(domain: string): Promise<string | undefined> {
    const domainResponse = await this.domainService
      .rootGet(ACCEPT, domain)
      .toPromise();

    const domainInfo = domainResponse.data;

    const rootGroup = domainInfo.root;
    return rootGroup;
  }
  public async getGroups(simId: string) {
    const domain = simId + '.results';

    const rootGroup = (await this.getRootGroupId(domain)) || '';
    this.linkService.groupsIdLinksLinknameGet;
    const rootGroupResponse = this.groupService
      .groupsIdGet(rootGroup, ACCEPT, domain)
      .toPromise();
    const groupsResponse = await this.domainService
      .groupsGet(ACCEPT, domain)
      .toPromise();

    const groups = groupsResponse.data.groups || [];
    const returned_groups = [];
    for (const group of groups) {
      const group_name = await this.getGroupName(group, domain);
      const linksResponse = await this.linkService
        .groupsIdLinksGet(group, ACCEPT, domain)
        .toPromise();
      const links = linksResponse.data.links;
      const return_group: {
        [key: string]: {
          links: InlineResponse2004Links[] | undefined;
          info: InlineResponse2003;
        };
      } = {};
      return_group[group] = { links: links, info: group_name };
      returned_groups.push(return_group);
    }

    return returned_groups;
  }
  async getGroupName(group: string, domain: string) {
    const response = await this.groupService
      .groupsIdGet(group, ACCEPT, domain)
      .toPromise();
    return response.data;
  }
  async getDatasets(simId: string) {
    const domain = simId + '.results';

    const response = await this.domainService
      .datasetsGet('application/json', domain)
      .toPromise();
    this.domainService.groupsPost;

    const datasetIds = response.data.datasets || [];
    const datasetNames = [];
    for (const datasetId of datasetIds) {
      const dataResponse = await this.datasetService
        .datasetsIdGet(datasetId, 'application/json', domain)
        .toPromise();
      const datasetAttributes = await this.attrbuteService
        .collectionObjUuidAttributesGet(
          'application/json',
          'datasets',
          datasetId,
          undefined,
          domain,
        )
        .toPromise();
      const datasetIdResponse = await this.attrbuteService
        .collectionObjUuidAttributesAttrGet(
          'application/json',
          'datasets',
          datasetId,
          'id',
          undefined,
          domain,
        )
        .toPromise();
      const datasetIdName = datasetIdResponse.data;
      datasetNames.push(dataResponse.data);
    }

    return datasetNames;
  }
}
