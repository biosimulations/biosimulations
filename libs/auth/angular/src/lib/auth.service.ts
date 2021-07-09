import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthEnvironment } from './auth.environment';
import createAuth0Client, {
  Auth0Client,
  GetUserOptions,
  GetTokenSilentlyOptions,
} from '@auth0/auth0-spa-js';
import {
  from,
  Observable,
  throwError,
  BehaviorSubject,
  of,
  combineLatest,
} from 'rxjs';
import { catchError, shareReplay, concatMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private redirectUri: string | undefined;
  private loggedIn = false;
  private token: string | null = null;
  // Create an observable of Auth0 instance of client
  // TODO allow for multiple api audiences per app
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private environment: AuthEnvironment,
  ) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }
  private auth0Client$ = (
    from(
      createAuth0Client({
        domain: this.environment.authDomain,
        client_id: this.environment.clientId,
        redirect_uri: this.environment.redirectUri,
        response_type: 'token id_token',
        scope: this.environment.scope,
        audience: this.environment.audience,
      }),
    ) as Observable<Auth0Client>
  ).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError((err) => throwError(err)),
  );

  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  readonly isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap((res) => (this.loggedIn = res)),
  );

  private handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback())),
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  readonly userProfile$ = this.userProfileSubject$.asObservable();

  private getUser$(options?: GetUserOptions): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap((user) => this.userProfileSubject$.next(user)),
    );
  }
  // Returns the value of loggedIn. Keeping logging in private is useful for testing with test bed
  isAuthenticated() {
    return !!this.loggedIn;
  }
  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      }),
    );
    checkAuth$.subscribe();
  }

  public login(redirectPath = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: this.environment.redirectUri,
        appState: { target: redirectPath },
      });
    });
  }

  // TODO replace window with activated route params
  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap((cbRes) => {
          // Get and set target redirect route from callback results
          targetRoute =
            cbRes.appState && cbRes.appState.target
              ? cbRes.appState.target
              : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([this.getUser$(), this.isAuthenticated$]);
        }),
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        this.router.navigate([targetRoute]);
      });
    }
  }

  public logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: this.environment.clientId,
        returnTo: this.environment.logoutUri,
      });
    });
  }

  public getTokenSilently$(
    options?: GetTokenSilentlyOptions,
  ): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) =>
        from(client.getTokenSilently(options)),
      ),
    );
  }
}
