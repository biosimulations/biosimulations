import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../../services/dispatch/dispatch.service';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {


  simulators = ['COPASI', 'VCell'];
  selectedSimulator = this.simulators[0];
  // TODO: Fix this default assignment to file
  fileToUpload: File = new File([],'');

  constructor(private dispatchService: DispatchService) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0) as File;
  }

  onClickSubmit() {
    // const selectedSimulator = '';
    this.dispatchService.submitJob(this.fileToUpload, this.selectedSimulator).
      subscribe(
      (data: object) => {
        console.log('Response from server: ', data);
        alert('Job was submitted successfully!')
      },
      (error: object) => {
        console.log('Error occured while submitting simulation job: ', error)
      });
  }

}
