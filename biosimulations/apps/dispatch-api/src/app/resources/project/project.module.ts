import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectsController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './project.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'userProject', schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService],
})
export class ProjectModule {}
