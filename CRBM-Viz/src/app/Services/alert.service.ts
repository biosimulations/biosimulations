import { Injectable } from '@angular/core';
import { AlertComponent } from '../Components/alert/alert.component';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public dialog: MatDialog) { }

  openDialog(msg: string): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {message: msg}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
