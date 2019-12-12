import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { JournalReference } from 'src/app/Shared/Models/journal-reference';
import { RemoteFile } from 'src/app/Shared/Models/remote-file';
import { VisualizationSchema } from 'src/app/Shared/Models/visualization-schema';
import { UserService } from 'src/app/Shared/Services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationSchemaService {
  private userService: UserService;

  constructor(
    private http: HttpClient,
    private injector:Injector) {}

  static _get(id: string, includeRelatedObjects = false): VisualizationSchema {
    const schema: VisualizationSchema = new VisualizationSchema();
    schema.id = id;
    schema.name = 'Schema-' + id.toString();

    if (id === '002') {
      schema.image = new RemoteFile()
      schema.image.name = 'visualization.png';
      schema.image.type = 'image/png';
      schema.image.size = 3986;
      schema.image.url = 'assets/examples/visualization-image.png';
    }

    schema.description = 'Schema for a visualization of a simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
    schema.tags = ['tag-1', 'tag-2'];
    schema.refs = [
      new JournalReference('Jonathan R Karr & Bilal Shaikh', 'Title', 'Journal', 101, 3, '10-20', 2019),
      new JournalReference('Yara Skaf & Mike Wilson', 'Title', 'Journal', 101, 3, '10-20', 2019),
    ];
    schema.owner = UserService._get('jonrkarr');
    schema.access = AccessLevel.private;
    schema.license = License.cc0;
    schema.created = new Date(Date.parse('2019-11-06 00:00:00'));
    schema.updated = new Date(Date.parse('2019-11-06 00:00:00'));
    return schema;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
    }
  }

  get(id: string): VisualizationSchema {
    return VisualizationSchemaService._get(id, true);
  }

  list(name?: string, owner?: string): VisualizationSchema[] {
    // TODO: filter on name, owner attributes
    const data: VisualizationSchema[] = [
      this.get('001'),
      this.get('002'),
      this.get('003'),
      this.get('006'),
    ];
    return this.filter(data, name) as VisualizationSchema[];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item => item['name'].toLowerCase().includes(lowCaseName));
    } else {
      return list;
    }
  }

  set(data: VisualizationSchema, id?: string): string {
    if (!id) {
      // assign new ID
    }

    data.id = id;
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}
}
