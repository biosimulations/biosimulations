import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { VisualizationSchemaDataFieldType } from '../Enums/visualization-schema-data-field-type';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { User } from './user';
import { Visualization } from './visualization';
import { VisualizationSchemaDataField } from './visualization-schema-data-field';
import { ModelService } from '../Services/model.service';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { VisualizationService } from '../Services/visualization.service';

export class VisualizationSchema {
  id?: string;
  name?: string;
  spec?: object | string;
  image?: File | RemoteFile;
  description?: string;
  tags?: string[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;

  getDataFields(): VisualizationSchemaDataField[] {
    const fields: VisualizationSchemaDataField[] = [];
    for (let iField = 0; iField < 3; iField++) {
      const field: VisualizationSchemaDataField = new VisualizationSchemaDataField();
      field.name = `field-${ iField + 1}`;
      field.type = (iField === 1 ? VisualizationSchemaDataFieldType.array : VisualizationSchemaDataFieldType.scalar);
      fields.push(field);
    }
    return fields;
  }

  getProjects(): Project[] {
    return [
      ProjectService._get('001'),
      ProjectService._get('002'),
      ProjectService._get('003'),
    ];
  }

  getModels(): Model[] {
    return [
      ModelService._get('001'),
      ModelService._get('002'),
      ModelService._get('003'),
    ];
  }

  getSimulations(): Simulation[] {
    return [
      SimulationService._get('001'),
      SimulationService._get('002'),
      SimulationService._get('003'),
    ];
  }

  getVisualizations(): Visualization[] {
    return [
      VisualizationService._get(1),
      VisualizationService._get(2),
      VisualizationService._get(3),
    ];
  }
}
