import { Logger, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  private authConfig: any = this.configService.get('auth', {});
  private logger = new Logger(AuthService.name);
  constructor(
    private http: HttpService,
    private readonly configService: ConfigService
  ) {}
  async getToken(): Promise<string> {
    const res: any = await this.http
      .post(`${this.authConfig.auth0_domain}oauth/token`, {
        client_id: this.authConfig.client_id,
        client_secret: this.authConfig.client_secret,
        audience: this.authConfig.api_audience,
        grant_type: 'client_credentials',
      })
      .toPromise();
    return res.data.access_token;
  }
}
