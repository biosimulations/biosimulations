import { Injectable } from '@nestjs/common';
import { ManagementClient, User } from 'auth0';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthzService {
  authzClient: ManagementClient;
  constructor(private configService: ConfigService) {
    this.authzClient = new ManagementClient({
      domain: configService.get('auth.management_domain'),
      clientId: configService.get('auth.management_id'),
      clientSecret: configService.get('auth.management_secret'),
      scope: 'read:users update:users',
    });
  }

  getUser(id: string) {
    this.authzClient.getUser({ id });
  }

  updateAppMetadata(id: string, metadata: any) {
    this.authzClient.updateAppMetadata({ id }, metadata, (err, user) => {
      // TODO handle error
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
  }

  updateUserMetadata(id: string, metadata: any) {
    this.authzClient.updateUserMetadata({ id }, metadata, (err, user) => {
      // TODO handle error
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
  }
}
