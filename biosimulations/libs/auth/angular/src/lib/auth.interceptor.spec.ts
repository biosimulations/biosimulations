import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { AuthEnvironment } from './auth.environment';
import { HttpClient, HttpRequest, HttpHandler } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let service: AuthInterceptor;
  let httpTest: HttpTestingController;
  let http: HttpClient;
  const authStub = {
    getTokenSilently$: jest.fn(() => of('SuperSecretToken')),
    isAuthenticated: jest.fn(() => true),
  };
  const authEnv = {
    apiDomain: 'protectMe.com',
  };

  const reqHandler = {
    handle(req: HttpRequest<any>) {
      return http.request(req);
    },
  };
  let authSpy: any;
  let tokenSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: AuthEnvironment, useValue: authEnv },
      ],
    });

    authSpy = jest.spyOn(authStub, 'isAuthenticated');
    tokenSpy = jest.spyOn(authStub, 'getTokenSilently$');

    service = TestBed.inject(AuthInterceptor);
    httpTest = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTest.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should add token to protected domain', () => {
    const req = new HttpRequest('GET', authEnv.apiDomain + '/someRoute');

    service.intercept(req, reqHandler as any).subscribe();
    const editedReq = httpTest.expectOne(authEnv.apiDomain + '/someRoute');

    expect(editedReq.request.headers.has('Authorization')).toEqual(true);
    expect(editedReq.request.headers.get('Authorization')).toBe(
      'Bearer SuperSecretToken',
    );
  });

  it('Should not add a token to a non protected domain', () => {
    const req = new HttpRequest('GET', 'www.notProtected.com' + '/someRoute');

    service.intercept(req, reqHandler as any).subscribe();
    const editedReq = httpTest.expectOne('www.notProtected.com' + '/someRoute');

    expect(editedReq.request.headers.has('Authorization')).toEqual(false);
  });

  it('Should not add a token if user is not logged in', () => {
    const req = new HttpRequest('GET', authEnv.apiDomain + '/someRoute');
    authSpy.mockReturnValueOnce(false);
    service.intercept(req, reqHandler as any).subscribe();
    const editedReq = httpTest.expectOne(authEnv.apiDomain + '/someRoute');

    expect(editedReq.request.headers.has('Authorization')).toEqual(false);
  });

  it('Should proceed if token gives error', () => {
    const req = new HttpRequest('GET', authEnv.apiDomain + '/someRoute');
    tokenSpy.mockReturnValueOnce(throwError('test'));
    service.intercept(req, reqHandler as any).subscribe();
    const editedReq = httpTest.expectOne(authEnv.apiDomain + '/someRoute');
    expect(editedReq.request.headers.has('Authorization')).toEqual(false);
  });

  it('Should proceed if token is null', () => {
    const req = new HttpRequest('GET', authEnv.apiDomain + '/someRoute');
    tokenSpy.mockReturnValue(of(null) as any);
    service.intercept(req, reqHandler as any).subscribe();
    const editedReq = httpTest.expectOne(authEnv.apiDomain + '/someRoute');
    expect(editedReq.request.headers.has('Authorization')).toEqual(false);
  });
});
