/**
 * @file Test file for the results controller
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ResultsModel } from './results.model';
import { ResultsService } from './results.service';

describe('ResultsController', () => {
  let controller: ResultsController;
  class mockFile {
    data: any;
    save: () => any;
    constructor(body: any) {
      this.data = body;
      this.save = () => {
        return this.data;
      };
    }
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule],
      providers: [
        ResultsService,
        {
          provide: getModelToken(ResultsModel.name),
          useClass: mockFile,
        },
      ],
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
