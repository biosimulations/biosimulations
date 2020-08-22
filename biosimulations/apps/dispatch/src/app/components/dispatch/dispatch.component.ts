import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../../services/dispatch/dispatch.service';
import { VisualisationService } from '../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  simulators: Array<string> = [];
  selectedSimulator = '';
  versions: Array<string> = []
  selectedVersion = '';
  // TODO: Fix this default assignment to file
  fileToUpload: File = new File([],'');

  constructor(
    private dispatchService: DispatchService,
    ) { }

  ngOnInit(): void {
    this.dispatchService.getAllSimulatorInfo()
    .subscribe(
      (data: Array<string>) => {
        this.simulators = data;
        this.selectedSimulator = this.simulators[0];
      
        this.dispatchService.getAllSimulatorInfo(this.selectedSimulator)
        .subscribe(
          (dat: Array<string>) => {
            this.versions = dat;
            this.selectedVersion = this.versions[0];
          }
        ); 
     },
     (error: any) => {
       console.log('Error while fetching simulators and versions: ', error);
     }
    )
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0) as File;
  }

  onClickSubmit() {
    // const selectedSimulator = '';
    this.dispatchService.submitJob(this.fileToUpload, this.selectedSimulator, this.selectedVersion).
      subscribe(
      (data: any) => {
        console.log('Response from server: ', data);
        // TODO: Return id-> uuid from dispatch API on successful simulation
        const uuid = data['data']['id'];
        this.dispatchService.uuidsDispatched.push(uuid);
        this.dispatchService.uuidUpdateEvent.next(uuid);
        alert('Job was submitted successfully!')
      },
      (error: object) => {
        console.log('Error occured while submitting simulation job: ', error)
      });
  }

  onSimulatorChange($event: any) {
    this.dispatchService.getAllSimulatorInfo($event['value'])
        .subscribe(
          (dat: Array<string>) => {
            this.versions = dat;
            this.selectedVersion = this.versions[0];
          }
    );
  }

}
