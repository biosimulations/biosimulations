import { Component, Input, OnInit } from '@angular/core';
import { Path, ProjectMetadata } from '@biosimulations/datamodel-simulation-runs';
import { MatDialog } from '@angular/material/dialog';
import { MetadataDialogComponent } from '../metadata-dialog/metadata-dialog.component';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  @Input()
  public files!: Path[];

  @Input()
  public usesMaster = false;

  @Input()
  public usesMetadata = false;

  @Input()
  public useMetadata = false;

  public cardState = 'default';

  public hasSimularium?: boolean;

  public simulariumUrl = 'https://simularium.allencell.org/viewer';

  public constructor(private dialog: MatDialog) {
    /* Constructor is empty */
  }

  // TODO: Remove this OnInit as it is a test
  public ngOnInit() {
    const dummySimulariumFile: Path = {
      title: 'sim.simularium',
      format: 'Simularium spec',
      size: '1KB',
      level: 0,
      _type: 'File',
      location: 'simulation.simularium',
      basename: 'Min1.txt',
      formatUrl: 'https://github.com/simularium/simulariumio',
      icon: "file",
      master: false,
      url: 'https://github.com/ssandrews/Smoldyn/blob/master/examples/S99_more/Min/Min1.txt'
    }
    this.files.push(dummySimulariumFile);
    for (let i = 0; i < this.files.length; i++) {
      const fp = this.files[i];
      console.log(`The file: ${fp.title}, ${fp.location}`);
      this.hasSimularium = fp.title.includes('simularium');
    }
  }

  public getFile(path: Path): Path {
    return path;
  }

  public getGridTemplateColumns(): string {
      return this.hasSimularium ? 'repeat(5, 1fr)': 'repeat(4, 1fr)';
  }

  public openMetadata(metadata: ProjectMetadata): void {
    this.dialog.open(MetadataDialogComponent, {
      width: 'min(calc(1400px - 4rem), calc(100vw - 1.5rem))',
      data: metadata,
    });
  }

  public isTextOverflowed(text: string): boolean {
    const element = document.createElement('span');
    element.style.visibility = 'hidden';
    element.style.position = 'fixed';
    element.style.pointerEvents = 'none';
    element.textContent = text;
    document.body.appendChild(element);
    const isOverflowed = element.offsetWidth < element.scrollWidth;
    document.body.removeChild(element);
    return isOverflowed;
  }
}
