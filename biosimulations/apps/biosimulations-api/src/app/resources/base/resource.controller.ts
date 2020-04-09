import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
export abstract class ResourceController<T> {
  constructor(
    private readonly service: ResourceService<T>,
    private resourceName: string,
  ) {}
  @Get()
  search() {
    return this.service.getAll();
  }
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getOne(id);
  }
  @Post()
  create(body: T) {}

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }
  @Put(':id')
  replace(id: string, body: any) {}

  @Patch(':id')
  update(id: string, body: any) {}
}
