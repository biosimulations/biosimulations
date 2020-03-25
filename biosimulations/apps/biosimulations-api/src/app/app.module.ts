import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ResourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
