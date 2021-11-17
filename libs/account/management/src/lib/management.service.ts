import { Injectable } from '@nestjs/common';
import { ManagementClient, User, Client, Organization } from 'auth0';
import { ConfigService } from '@nestjs/config';
import { scopes } from '@biosimulations/auth/common';

@Injectable()
export class ManagementService {
  authzClient: ManagementClient;

  constructor(private configService: ConfigService) {
    this.authzClient = new ManagementClient({
      domain: configService.get('auth.management_domain') as string,
      clientId: configService.get('auth.management_id'),
      clientSecret: configService.get('auth.management_secret'),
      scope: [
        scopes.users.read.id,
        scopes.users.update.id,
        scopes.clients.read.id,
        scopes.organizations.read.id,
      ].join(' '),
    });
  }

  /**
   * @param id user or client id
   */
  isClientId(id: string): boolean {
    return id.endsWith('@clients');
  }

  /**
   * @param id user or client id
   */
  isUserId(id: string): boolean {
    return !this.isClientId(id);
  }

  /**
   * @param id user or client id
   */
  getAccount(id: string): Promise<any> {
    if (this.isClientId(id)) {
      return this.getClient(id);
    } else {
      return this.getUser(id);
    }
  }

  /**
   * @param id user id
   */
  getUser(id: string): Promise<User> {
    return this.authzClient.getUser({ id });
  }

  getUsers(page = 0, perPage = 10): Promise<User[]> {
    return this.authzClient.getUsers({ page, per_page: perPage });
  }

  /**
   * @param id client id
   */
  getClient(id: string): Promise<Client> {
    return this.authzClient.getClient({ client_id: id.substring(0, id.length - '@clients'.length) });
  }

  getClients(page = 0, perPage = 10): Promise<Client[]> {
    return this.authzClient.getClients({ page, per_page: perPage });
  }

  /**
   * @param id organization id
   */
  getOrganization(id: string): Promise<Organization> {
    return this.authzClient.organizations.getByID({ id });
  }

  getOrganizations(page = 0, perPage = 10): Promise<Organization[]> {
    return this.authzClient.organizations.getAll({ page, per_page: perPage });
  }

  /**
   * @param id user id
   */
  getUserOrganizations(id: string): Promise<any[]> {
    return (this.authzClient as any).users.getUserOrganizations({ id }); // `any` used because `users` is not included in the typing
  }

  updateAppMetadata(id: string, metadata: any) {
    this.authzClient.updateAppMetadata(
      { id },
      metadata,
      (err: any, user: any) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Updated User' + user.user_id);
          console.log('Added App MetaData' + user.app_metadata);
        }
      },
    );
  }

  updateUserMetadata(id: string, metadata: any) {
    this.authzClient.updateUserMetadata(
      { id },
      metadata,
      (err: any, user: any) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Updated User' + user.user_id);
          console.log('Added UserMetadata' + user.user_metadata);
        }
      },
    );
  }
}
