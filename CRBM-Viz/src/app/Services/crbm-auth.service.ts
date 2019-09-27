import { Injectable, OnInit } from '@angular/core';
import { SocialUser, AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from '../crbm-config';

@Injectable({
    providedIn: 'root',
})
export class CrbmAuthService {
    user: SocialUser;
    loggedInState = false;
    constructor(
        public socialAuthService: AuthService,
        private router: Router,
        private http: HttpClient
    ) {}

    login() {
        const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        this.socialAuthService.signIn(socialPlatformProvider)
        .then((userData) => {
          this.loggedInState =   (userData !== null);
          this.user = userData;
          this.sendToRestApiMethod(userData);
          console.log('User logged in: ', this.user);
          this.router.navigate(['']);
        });
    }

    logout() {
        this.user = null;
        this.loggedInState = false;
        console.log('User logged in: ', this.user);
        this.router.navigate(['']);
    }

    sendToRestApiMethod(userData: object): void {
        this.http.post(`${CrbmConfig.CRBMAPI_URL}/user`,
           userData
        ).subscribe(
           onSuccess => {
             console.log('Data sent to backend', onSuccess);
             }, onFail => {
            console.log('Connect to backend failed!', onFail);
           }
        );
          }
}
