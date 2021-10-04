import { Test } from '@nestjs/testing';
import { AuthClientService } from './auth-client.service';

import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('AuthClientService', () => {
  let service: AuthClientService;
  let httpService: HttpService;
  const MockConfigService = {
    get: (key: string, def: any) => {
      return {
        client_id: 'id',
        client_secret: 'secret',
        auth0_domain: 'domain/', // THe domain in the config ends with /
        api_audience: 'audience',
      };
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AuthClientService,
        { provide: ConfigService, useValue: MockConfigService },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    service = module.get(AuthClientService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
  it('should set config', () => {
    expect((service as any).auth0_domain).toBe(
      MockConfigService.get('', '').auth0_domain,
    );
    expect((service as any).client_secret).toBe(
      MockConfigService.get('', '').client_secret,
    );
    expect((service as any).client_id).toBe(
      MockConfigService.get('', '').client_id,
    );
    expect((service as any).api_audience).toBe(
      MockConfigService.get('', '').api_audience,
    );
  });
  it('should call client_credentials Endpoint', async () => {
    const result: any = {
      data: {
        access_token: 'test_token',
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };
    const spy = jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => of(result));
    const token = await service.getToken();
    expect(token).toBe(result.data.access_token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('domain/oauth/token', {
      audience: MockConfigService.get('', '').api_audience,
      client_id: MockConfigService.get('', '').client_id,
      client_secret: MockConfigService.get('', '').client_secret,
      grant_type: 'client_credentials',
    });
  });
  it('should override auidence', async () => {
    const result: any = {
      data: {
        access_token: 'test_token',
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };
    const spy = jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => of(result));
    const testAudience = 'testAPIAudience';
    const token = await service.getToken(testAudience);
    expect(token).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('domain/oauth/token', {
      audience: testAudience,
      client_id: MockConfigService.get('', '').client_id,
      client_secret: MockConfigService.get('', '').client_secret,
      grant_type: 'client_credentials',
    });
  });
  it('should return token', async () => {
    const result: any = {
      data: {
        access_token: 'test_token',
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };
    jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(result));
    const token = await service.getToken();

    expect(token).toBe(result.data.access_token);
  });
});
