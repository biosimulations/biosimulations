import { Component } from '@angular/core';
import { CrbmAuthService } from './Services/crbm-auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
})
export class AppComponent {
    title = 'CRBM-Viz';

    constructor(public crbmAuthService: CrbmAuthService) {}
}
