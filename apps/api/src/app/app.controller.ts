import { ClientProxy } from '@nestjs/microservices';
import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
@Controller()
export class AppController implements OnApplicationBootstrap {
  public constructor(
    @Inject('NATS_CLIENT') private messageClient: ClientProxy,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.messageClient.connect();
  }
}
