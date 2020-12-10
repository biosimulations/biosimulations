import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export interface DispatchSimulator {
  id: string;
  version: string;
}
