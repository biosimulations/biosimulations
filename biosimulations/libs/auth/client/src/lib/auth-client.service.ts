import { Logger, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthClientService {
    private authConfig: any = this.configService.get('auth', {});
    private logger = new Logger(AuthClientService.name);
    private client_id: string;
    private api_audience: string;
    private client_secret: string;
    private auth0_domain: string
    constructor(
        private http: HttpService,
        private readonly configService: ConfigService
    ) {
        this.auth0_domain = this.authConfig.auth0_domain
        this.client_id = this.authConfig.client_id
        this.api_audience = this.authConfig.api_audience
        this.client_secret = this.authConfig.client_secret

    }
    public async getToken(audience = this.api_audience): Promise<string> {
        this.logger.debug(`Getting auth token for audience ${this.api_audience} for client ${this.client_id}`)
        const res: any = await this.http
            .post(`${this.auth0_domain}oauth/token`, {
                client_id: this.client_id,
                client_secret: this.client_secret,
                audience: audience,
                grant_type: 'client_credentials',
            })
            .toPromise();
        return res.data.access_token;
    }
}
