import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { Thumbnail } from '@biosimulations/datamodel/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ModuleMocker } from 'jest-mock';
import { ModuleRef } from '@nestjs/core';
const moduleMocker = new ModuleMocker(global);

describe('FilesController', () => {
  let controller: FilesController;
  let service: any;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule],

      controllers: [FilesController],
    })
      .useMocker((token) => {
        if (token === FilesService) {
          return {
            getFile: jest.fn().mockImplementation(() => {
              return {
                id: 'file1',
                simulationRun: 'run1',
                format: 'application/json',
                master: true,
                size: 100,
                name: 'file1',
                location: 'file1',
                type: 'application/json',
                created: new Date('2022-01-31T15:40:28.900Z'),
                updated: new Date('2022-01-31T15:40:28.900Z'),
                url: 'https://files.biosimulations.org/testfile',
                thumbnailUrls: {
                  view: 'https://files.biosimulations.org/testfile/thumbnail/view',
                  browse:
                    'https://files.biosimulations.org/testfile/thumbnail/browse',
                },
              };
            }),
            createFiles: jest.fn().mockImplementation(() => {
              return [
                {
                  id: 'file1',
                  simulationRun: 'run1',
                  format: 'application/json',
                  master: true,
                  size: 100,
                  name: 'file1',
                  location: 'file1',
                  type: 'application/json',
                  url: 'https://files.biosimulations.org/testfile',
                  created: new Date('2022-01-31T15:40:28.900Z'),
                  updated: new Date('2022-01-31T15:40:28.900Z'),
                },
              ];
            }),
          };
        }
      })
      .compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create and return files', async () => {
    const result = await controller.createFiles(
      'run1',

      {
        files: [
          {
            id: 'testfile',
            master: true,
            url: 'https://files.biosimulations.org/testfile',
            location: 'testfile',
            name: 'testfile',
            size: 100,
            format: 'application/octet-stream',
          },
        ],
      },
    );
    expect(result).toEqual([
      {
        created: '2022-01-31T15:40:28.900Z',
        format: 'application/json',
        id: 'file1',
        location: 'file1',
        master: true,
        name: 'file1',
        simulationRun: 'run1',
        size: 100,
        updated: '2022-01-31T15:40:28.900Z',
        url: 'https://files.biosimulations.org/testfile',
      },
    ]);
  });

  it('should redirect to url to download file', async () => {
    const result = await controller.downloadFile('simId', 'testfile');
    expect(result).toEqual({
      url: 'https://files.biosimulations.org/testfile',
      statusCode: 301,
    });
  });

  it('Should return a file without any extra values', async () => {
    const file = await controller.getFile('simId', 'testfile');
    expect(file).toEqual({
      created: '2022-01-31T15:40:28.900Z',
      format: 'application/json',
      id: 'file1',
      location: 'file1',
      master: true,
      name: 'file1',
      simulationRun: 'run1',
      size: 100,
      updated: '2022-01-31T15:40:28.900Z',
      url: 'https://files.biosimulations.org/testfile',
    });
  });
  it('should redirect to download thumbnail', async () => {
    const results = await controller.downloadFile(
      'simId',
      'testfile',
      Thumbnail.view,
    );
    expect(results).toEqual({
      url: 'https://files.biosimulations.org/testfile/thumbnail/view',
      statusCode: 301,
    });
  });

  it('should handle missing thumbnails', async () => {
    // override default mock to remove thumbnailUrls
    service.getFile = jest.fn().mockImplementation(() => {
      return {
        url: 'https://files.biosimulations.org/testfile',
      };
    });

    const result = await controller.downloadFile(
      'simID',
      'fileLocation',
      Thumbnail.view,
    );
    expect(result).toEqual({
      url: 'https://files.biosimulations.org/testfile',
      statusCode: 301,
    });
  });
});
