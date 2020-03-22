import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth0.service';
import { environment } from 'src/environments/environment';
import { BrtData, BrtError } from '@bruit/component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.sass'],
})
export class FeedbackComponent implements OnInit {
  public readonly bruitConfig = environment.bruitConfig;
  public bruitData: Array<BrtData> = [
    {
      label: 'date',
      type: 'Date',
      value: new Date(Date.now()),
    },
    {
      label: 'user',
      type: 'string',
      value: null,
    },
  ];

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.authService.localAuthSetup();
    this.authService.userProfile$.subscribe(profile => {
      this.authService.getToken$().subscribe(token => {
        if (token) {
          this.bruitData[1].value = token.sub;
        }
      });
    });
  }

  handleBruitError(error: BrtError) {
    // console.log(error.code, error.text);
    this.snackBar.open('Unable to submit feedback', 'Dismiss');
  }
}
