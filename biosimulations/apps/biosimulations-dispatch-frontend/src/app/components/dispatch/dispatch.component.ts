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
  simulatorVersionMap: any;

  constructor(
    private dispatchService: DispatchService,
    ) { }

  ngOnInit(): void {
    this.dispatchService.getAllSimulatorInfo()
    .subscribe(
      (data: any) => {
        this.simulatorVersionMap = data['data'];
        this.simulators = Object.keys(this.simulatorVersionMap);
        this.selectedSimulator = this.simulators[0];
        this.versions = this.simulatorVersionMap[this.selectedSimulator];
        this.selectedVersion = this.versions[0];
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
        const uuid = data['id'];
        this.dispatchService.uuidsDispatched.push(uuid);
        this.dispatchService.uuidUpdateEvent.next(uuid);
        alert('Job was submitted successfully!')
      },
      (error: object) => {
        console.log('Error occured while submitting simulation job: ', error)
      });
  }

  onSimulatorChange($event: any) {
    this.versions = this.simulatorVersionMap[$event['value']]
    this.selectedVersion = this.versions[0];
  }

}
