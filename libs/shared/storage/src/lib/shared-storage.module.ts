import { Global, Module } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationStorageService } from './simulation-storage.service';
import { FilePaths } from './file-paths';

@Global()
@Module({
  controllers: [],
  imports: [BiosimulationsConfigModule],
  providers: [SharedStorageService, SimulationStorageService, FilePaths],
  // Dont export SharedStorageService, as it should only be used by the SimulationStorageService
  exports: [SimulationStorageService, FilePaths],
})
export class SharedStorageModule {}
