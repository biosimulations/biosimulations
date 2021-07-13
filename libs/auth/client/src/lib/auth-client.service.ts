import { Logger, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasAudience, isTokenCurrent } from '@biosimulations/auth/common';

@Injectable({})
export class AuthClientService {
  private authConfig: any = this.configService.get('auth');
  private logger = new Logger(AuthClientService.name);
  private client_id: string;
  private api_audience: string;
  private client_secret: string;
  private auth0_domain: string;
  private token?: string;

  public constructor(
    private http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.auth0_domain = this.authConfig.auth0_domain;
    this.client_id = this.authConfig.client_id;
    this.api_audience = this.authConfig.api_audience;
    this.client_secret = this.authConfig.client_secret;
  }
  public async getToken(
    audience = this.api_audience,
  ): Promise<string | undefined> {
    this.logger.debug(
      `Getting auth token for audience ${audience} for client ${this.client_id}`,
    );

    // If we have a token cached and its not expired send it. Also check that it is for same audience
    if (this.token) {
      if (isTokenCurrent(this.token) && hasAudience(this.token, audience)) {
        return this.token;
      }
    }

    const newTok = await this.getTokenHTTP(audience).toPromise();
    this.token = newTok;
    return newTok;
  }

  private getTokenHTTP(audience = this.api_audience): Observable<string> {
    const res: any = this.http
      .post(`${this.auth0_domain}oauth/token`, {
        client_id: this.client_id,
        client_secret: this.client_secret,
        audience: audience,
        grant_type: 'client_credentials',
      })
      .pipe(
        map((value) => {
          return value.data.access_token as string;
        }),
      );

    return res;
  }
}
