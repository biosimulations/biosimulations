import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ManagementService {
  authzClient: ManagementClient;
  constructor(private configService: ConfigService) {
    this.authzClient = new ManagementClient({
      domain: configService.get('auth.management_domain') as string,
      clientId: configService.get('auth.management_id'),
      clientSecret: configService.get('auth.management_secret'),
      scope: 'read:users update:users',
    });
  }

  getUser(id: string) {
    this.authzClient.getUser({ id });
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
