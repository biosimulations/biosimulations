import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { CrbmAuthService } from 'src/app/Services/crbm-auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    private socialAuthService: AuthService,
    private http: HttpClient,
    private crbmAuthService: CrbmAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.crbmAuthService.user = user;
      this.crbmAuthService.loggedInState = (user !== null);
      console.log('User state changed: ',
        this.crbmAuthService.user,
        'login state: ',
        this.crbmAuthService.loggedInState);
    });
  }

  public signinWithGoogle() {
    const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider)
    .then((userData) => {
       //  on success
       //  this will return user data from google. What you need is a user token which you will send it to the server

      //   this.sendToRestApiMethod(userData.idToken);
      console.log('User logged in: ', userData);
      this.router.navigate(['']);
    });
  }

  sendToRestApiMethod(token: string): void {
    this.http.post('http:// localhost:5000/login',
       {
          token
       }
    ).subscribe(
       onSuccess => {
         console.log('Login was successful', onSuccess);
          // login was successful
          // save the token that you got from your REST API in your preferred location
          // i.e. as a Cookie or LocalStorage as you do with normal login
       }, onFail => {
        console.log('Login failed!', onFail)
          // login was unsuccessful
          // show an error message
       }
    );
      }
}
