import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {
  from,
  of,
  Observable,
  BehaviorSubject,
  combineLatest,
  throwError,
} from 'rxjs';
import {
  tap,
  catchError,
  concatMap,
  shareReplay,
  concatAll,
  map,
  pluck,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Create an observable of Auth0 instance of client
  returnTo = window.location.origin + environment.baseUrl;
  redirect = this.returnTo + 'callback';
  // TODO determine the correct scopes and add here
  auth0Client$ = (from(
    createAuth0Client({
      domain: environment.auth0.domain,
      client_id: environment.auth0.clientId,
      redirect_uri: this.redirect,
      response_type: 'token id_token',
      scope: 'update:current_user_metadata read:current_user read:models',
      audience: environment.auth0.audience,
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => (this.loggedIn = res))
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();

  // Create local property to store token
  token: string = null;
  // Create a local property for login status
  loggedIn: boolean = null;

  constructor(private router: Router, private http: HttpClient) {}

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  getUsername$(): Observable<string> {
    return this.getUser$().pipe(
      pluck('https://www.biosimulations.org:app_metadata', 'username')
    );
  }

  getToken$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) =>
        from(client.getIdTokenClaims(options))
      ),
      tap(token => (this.token = token))
    );
  }
  getTokenSilently$(options?): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
    );
  }

  localAuthSetup() {
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
      })
    );
    checkAuth$.subscribe((response: { [key: string]: any } | boolean) => {
      // If authenticated, response will be user object
      // If not authenticated, response will be 'false'
      this.loggedIn = !!response;

      this.getToken$().subscribe(token => {
        localStorage.setItem('token', token);
      });
    });
  }

  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: this.redirect,
        appState: { target: redirectPath },
      });
    });
  }

  handleAuthCallback() {
    // Only the callback component should call this method
    // Call when app reloads after user logs in with Auth0
    let targetRoute: string; // Path to redirect to after login processsed
    const authComplete$ = this.handleRedirectCallback$.pipe(
      // Have client, now call method to handle auth callback redirect
      tap(cbRes => {
        // Get and set target redirect route from callback results
        targetRoute =
          cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
      }),
      concatMap(() => {
        // Redirect callback complete; get user and login status
        return combineLatest([this.getUser$(), this.isAuthenticated$]);
      })
    );
    // Subscribe to authentication completion observable
    // Response will be an array of user and login status
    authComplete$.subscribe(([user, loggedIn]) => {
      // Call a method in the user serivce to ensure that the user exists in the database

      this.confirmExists(user);

      // Redirect to target route after callback processing
      this.router.navigate([targetRoute]);
    });
  }
  /**
   * This method takes in a user profile and calls an api endpoint to ensure that the user is in the database
   * The user might not be in the database if they are using a new account.
   * @param  user The user profile object that is returned by the authentication service
   *
   */
  confirmExists(userProfile: any) {
    const user = new User();
    user.userId = userProfile.sub;
    if (userProfile.email) {
      user.email = userProfile.email;
    }
    user.username =
      userProfile['https://www.biosimulations.org:app_metadata']['username'];
    user.firstName = userProfile.given_name;
    user.lastName = userProfile.given_name;
    this.http
      .post(environment.crbm.CRBMAPI_URL + '/users', user)
      .subscribe(res => {
        if (!environment.production) {
          console.log(userProfile);
          console.log(
            'Called confirmed user exists endpoint for user' + userProfile.sub
          );
          console.log('got username' + res);
        }
      });
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: environment.auth0.clientId,
        returnTo: this.returnTo,
      });
      localStorage.removeItem('token');
    });
  }
}
