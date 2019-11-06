import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from 'src/app/Shared/Services/file.service';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.sass'],
})
export class FileEditComponent implements OnInit {
  accessTypes = [
    { value: 'private', viewValue: 'Private' },
    { value: 'public', viewValue: 'Public' },
  ];

  selectedValue = null;
  currentFile: object = null;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const fileId = this.route.snapshot.params['fileId'];
    this.fileService.getFile(fileId).subscribe(
      success => {
        this.currentFile = success['data'];
        this.selectedValue = this.currentFile['accessType'];
      },
      error => {
        console.log('Error in fetching specific file', error);
      }
    );
  }

  onClickSave() {
    this.fileService.saveFile(this.currentFile, this.selectedValue);
  }
}
