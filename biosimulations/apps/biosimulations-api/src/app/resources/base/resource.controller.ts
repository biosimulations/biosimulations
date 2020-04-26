import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ApiQuery } from '@nestjs/swagger';
export abstract class ResourceController<T> {
  constructor(
    private readonly service: ResourceService<T>,
    private resourceName: string,
  ) {}

  @ApiQuery({ name: 'test', required: false })
  @Get()
  search(@Query('test') param?: string) {
    return param;
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
