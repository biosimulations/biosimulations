import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Format } from '../Models/format';
import { Identifier } from '../Models/identifier';
import { JournalReference } from '../Models/journal-reference';
import { Model } from '../Models/model';
import { ModelParameter } from '../Models/model-parameter';
import { ModelVariable } from '../Models/model-variable';
import { OntologyTerm } from '../Models/ontology-term';
import { Person } from '../Models/person';
import { RemoteFile } from '../Models/remote-file';
import { Taxon } from '../Models/taxon';
import { User } from '../Models/user';
import { AlertService } from './alert.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private userService: UserService;

  fileList: Array<object> = null;
  fileChangeSubject = new Subject<null>();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private injector: Injector
  ) {}

  static _get(id: string, includeRelatedObjects = false): Model {
    let model: Model;

    switch (id) {
      default:
      case '001':
        model = new Model();
        model.id = id;
        model.name = 'EPSP ACh event';
        model.description =
          'Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
        model.taxon = new Taxon(7787, 'Tetronarce californica');
        model.tags = ['neurotransmission', 'signaling'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [new Identifier('biomodels.db', 'BIOMD0000000001')];
        model.refs = [
          new JournalReference(
            'Jonathan R Karr & Bilal Shaikh',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
          new JournalReference(
            'Yara Skaf & Mike Wilson',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
        ];
        model.owner = UserService._get('jonrkarr');
        model.access = AccessLevel.public;
        model.created = new Date(Date.parse('1996-11-01 00:00:00'));
        model.updated = new Date(Date.parse('1996-11-01 00:00:00'));
        break;

      case '002':
        model = new Model();
        model.id = id;
        model.name = 'EPSP ACh event';
        model.image = new RemoteFile();
        model.image.name = 'model.png';
        model.image.type = 'image/png';
        model.image.size = 3986;
        model.image.url = 'assets/examples/model-image.png';
        model.description =
          'Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
        model.taxon = new Taxon(7787, 'Tetronarce californica');
        model.tags = ['neurotransmission', 'signaling'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [new Identifier('biomodels.db', 'BIOMD0000000001')];
        model.refs = [
          new JournalReference(
            'Jonathan R Karr & Bilal Shaikh',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
          new JournalReference(
            'Yara Skaf & Mike Wilson',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
        ];
        model.owner = UserService._get('jonrkarr');
        model.access = AccessLevel.private;
        model.created = new Date(Date.parse('1996-11-01 00:00:00'));
        model.updated = new Date(Date.parse('1996-11-01 00:00:00'));
        break;

      case '003':
        model = new Model();
        model.id = '003';
        model.name = 'Min Mit Oscil';
        model.description =
          'Minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.';
        model.taxon = new Taxon(8292, 'Xenopus laevis');
        model.tags = ['cell cycle', 'mitosis'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [new Identifier('biomodels.db', 'BIOMD0000000003')];
        model.refs = [
          new JournalReference(
            'Jonathan R Karr & Bilal Shaikh',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
          new JournalReference(
            'Yara Skaf & Mike Wilson',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
        ];
        model.owner = UserService._get('a.goldbeter');
        model.access = AccessLevel.public;
        model.created = new Date(Date.parse('1991-10-15 00:00:00'));
        model.updated = new Date(Date.parse('1991-10-15 00:00:00'));
        break;

      case '006':
        model = new Model();
        model.id = '006';
        model.name = 'Cell Cycle 6 var';
        model.description =
          'Mathematical model of the interactions of cdc2 and cyclin.';
        model.taxon = new Taxon(33154, 'Homo sapiens');
        model.tags = ['cell cycle'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [new Identifier('biomodels.db', 'BIOMD0000000006')];
        model.refs = [
          new JournalReference(
            'Jonathan R Karr & Bilal Shaikh',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
          new JournalReference(
            'Yara Skaf & Mike Wilson',
            'Title',
            'Journal',
            101,
            3,
            '10-20',
            2019
          ),
        ];
        model.owner = UserService._get('j.tyson');
        model.access = AccessLevel.public;
        model.created = new Date(Date.parse('1991-08-15 00:00:00'));
        model.updated = new Date(Date.parse('1991-08-15 00:00:00'));
        break;
    }
    model.file = new RemoteFile();
    model.file.name = 'model.xml';
    model.file.type = 'application/sbml+xml';
    model.file.size = 1749;
    model.file.url = 'assets/examples/model.xml';

    model.parameters = [
      new ModelParameter('kcat', 'Catalytic rate', 1.5, 's^-1'),
      new ModelParameter('Km', 'Association constant', 2.1, 'dimensionless'),
      new ModelParameter('Vmax', 'Maximum rate', 3.1, 'catal'),
    ];

    model.framework = new OntologyTerm(
      'SBO',
      '0000062',
      'continuous framework',
      null,
      'http://biomodels.net/SBO/SBO_0000293'
    );
    model.authors = [
      new Person('Jimmie', 'D', 'Doe'),
      new Person('Jane', 'E', 'Doe'),
    ];
    model.license = License.cc0;
    return model;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
    }
  }

  get(id: string): Observable<Model> {
    this.getServices();
    return of(ModelService._get(id, true));
  }

  getVariables(model: Model): ModelVariable[] {
    const variables: ModelVariable[] = [];
    for (let iVariable = 0; iVariable < 3; iVariable++) {
      const variable = new ModelVariable();
      variable.id = `var-${iVariable + 1}`;
      variable.name = `Variable ${iVariable + 1}`;
      variables.push(variable);
    }
    return variables;
  }

  getParameters(model: Model, value?: string): ModelParameter[] {
    return this.filter(model.parameters, value, value) as ModelParameter[];
  }

  list(name?: string, owner?: string): Model[] {
    // TODO: filter on name, owner attributes
    const data: Model[] = [
      ModelService._get('001'),
      ModelService._get('002'),
      ModelService._get('003'),
      ModelService._get('006'),
    ];
    return this.filter(data, undefined, name) as Model[];
  }

  private filter(list: object[], id?: string, name?: string): object[] {
    let lowCaseId: string;
    let lowCaseName: string;
    if (id) {
      lowCaseId = id.toLowerCase();
    }
    if (name) {
      lowCaseName = name.toLowerCase();
    }

    if (id || name) {
      return list.filter(
        item =>
          (id && item['id'].toLowerCase().includes(lowCaseId)) ||
          (name && item['name'].toLowerCase().includes(lowCaseName))
      );
    } else {
      return list;
    }
  }

  set(data: Model, id?: string): string {
    this.getServices();

    if (!id) {
      id = '007';
    }

    data.id = id;
    data.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}

  /////////////////////////////
  // Methods from FileService
  uploadFile(file: File, accessType: string) {
    const endpoint = `${environment.crbm.CRBMAPI_URL}/file`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('accessType', accessType);
    this.http.post(endpoint, formData).subscribe(
      success => {
        this.alertService.openDialog(
          'File upload was successful: ' + JSON.stringify(success)
        );
        this.getFileData();
      },
      error => {
        this.alertService.openDialog(
          'File upload failed: ' + JSON.stringify(error)
        );
      }
    );
  }

  getFileData(): void {
    this.http.get(`${environment.crbm.CRBMAPI_URL}/file`).subscribe(
      success => {
        this.fileList = success['data'];
        this.fileChangeSubject.next();
      },
      error => {}
    );
  }

  deleteFile(fileId: number): void {
    this.http
      .delete(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`)
      .subscribe(
        success => {
          this.alertService.openDialog(
            'File deleted successfully' + JSON.stringify(success)
          );
          this.getFileData();
          this.fileChangeSubject.next();
        },
        error => {
          this.alertService.openDialog(
            'There was an error while deleting the file' + JSON.stringify(error)
          );
        }
      );
  }

  getFile(fileId: number) {
    return this.http.get(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`);
  }

  saveFile(currentFile: object, selectedValue: string): void {
    this.http
      .put(`${environment.crbm.CRBMAPI_URL}/file/${currentFile['fileId']}`, {
        accessType: selectedValue,
      })
      .subscribe(
        success => {
          console.log('File update successfull', success);
          this.alertService.openDialog('File update successful');
          this.router.navigate(['/models']);
        },
        error => {
          console.log('File update failed', error);
          this.alertService.openDialog('File update failed');
        }
      );
  }
}
