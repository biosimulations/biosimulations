import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor( private socialAuthService: AuthService, private http: HttpClient ) {}

  ngOnInit() {
  }

  public signinWithGoogle () {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
 
    this.socialAuthService.signIn(socialPlatformProvider)
    .then((userData) => {
       //on success
       //this will return user data from google. What you need is a user token which you will send it to the server
       this.sendToRestApiMethod(userData.idToken);
    });
  }

  sendToRestApiMethod(token: string) : void {
    this.http.post('http://localhost:5000/file',
       {
          token: token
       }
    ).subscribe(
       onSuccess => {
         console.log("Login was successful", onSuccess)
          //login was successful
          //save the token that you got from your REST API in your preferred location i.e. as a Cookie or LocalStorage as you do with normal login
       }, onFail => {
        console.log("Login failed!", onFail)
          //login was unsuccessful
          //show an error message
       }
    )
  };
   

 
}