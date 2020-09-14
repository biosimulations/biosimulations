import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ModelsService } from './models.service';
import { MQDispatch } from '@biosimulations/messages/dispatch'

@Controller()
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  @MessagePattern(MQDispatch.to_db)
  async dispatchDB(data: DispatchSimulationModelDB) {
    this.modelsService.createNewDispatchSimulationModel(data);
  }
}
