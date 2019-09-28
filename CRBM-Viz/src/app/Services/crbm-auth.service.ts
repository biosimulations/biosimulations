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
          console.log('User logged in: ', this.user);
          this.router.navigate(['']);
          localStorage.setItem('user', JSON.stringify(this.user));
          this.sendToRestApiMethod(userData);
        });
    }

    isLoggedIn() {
        try {
            this.user = JSON.parse(localStorage.getItem('user'));
        } catch (err) {
            this.user = null;
        }
        if (this.user) {
            this.loggedInState = true;
            return true;
        } else {
            return false;
        }

    }

    logout() {
        this.user = null;
        this.loggedInState = false;
        console.log('User logged in: ', this.user);
        this.router.navigate(['']);
        localStorage.removeItem('user');
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
