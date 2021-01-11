import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';

@Module({
  controllers: [],
  providers: [ManagementService],
  exports: [ManagementService],
})
export class AccountManagementModule { }
