import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';

@Injectable({
    providedIn: 'root',
})
export class CrbmAuthService {
    user: SocialUser;
    loggedInState = false;
    constructor() {}
}
