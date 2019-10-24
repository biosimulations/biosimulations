import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CustomLoaderService extends NgxSpinnerService {
  public spinCounts = 0;

  constructor(private spinner: NgxSpinnerService) {
    super();
  }

  showSpinner() {
    this.spinCounts += 1;
    this.spinner.show();
  }

  hideSpinner() {
    this.spinCounts -= 1;
    if (this.spinCounts <= 0) {
      this.spinner.hide();
      this.spinCounts = 0;
    }
  }
}
