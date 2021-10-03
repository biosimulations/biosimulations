import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FileModel, FileModelSchema } from './files.model';
import { FilesService } from './files.service';

@Module({
  imports: [
    BiosimulationsAuthModule,
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileModelSchema },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
