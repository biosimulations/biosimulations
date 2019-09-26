import { Injectable, OnInit } from '@angular/core';
import { SocialUser, AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class CrbmAuthService {
    user: SocialUser;
    loggedInState = false;
    constructor(
        public socialAuthService: AuthService,
        private router: Router
    ) {}

    login() {
        const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        this.socialAuthService.signIn(socialPlatformProvider)
        .then((userData) => {
          this.loggedInState =   (userData !== null);
          this.user = userData;
           //  on success
           //  this will return user data from google. What you need is a user token which you will send it to the server
          //   this.sendToRestApiMethod(userData.idToken);
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
}
