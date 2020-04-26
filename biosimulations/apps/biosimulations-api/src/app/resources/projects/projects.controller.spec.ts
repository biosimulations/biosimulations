import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

class MockProjectService implements ProjectsService {
  getAll(): void {
    throw new Error('Method not implemented.');
  }
  getOne(id: string): void {
    throw new Error('Method not implemented.');
  }
  createOne(body: any): void {
    throw new Error('Method not implemented.');
  }
  deleteOne(id: string): void {
    throw new Error('Method not implemented.');
  }
  replaceOne(): void {
    throw new Error('Method not implemented.');
  }
  updateOne(): void {
    throw new Error('Method not implemented.');
  }
}
describe('Projects Controller', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useClass: MockProjectService }],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
