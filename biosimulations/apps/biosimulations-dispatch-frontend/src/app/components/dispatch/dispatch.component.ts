import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../../services/dispatch/dispatch.service';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  // TODO: Fetch the simualtor and their versions dynamically from docker API
  simulators = [
    'COPASI latest', 'COPASI 4.27.214', 
    'VCell latest', 'VCell 7.2', 
    'BioNetGen latest', 'BioNetGen 2.5.0',
    'Tellurium latest', 'Tellurium 2.4.1'
  ];
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
