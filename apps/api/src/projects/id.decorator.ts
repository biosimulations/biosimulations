import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { projectIdRegExp } from './id.regex';
import { projectIdReservedIds } from './id.reservedIds';

export const ProjectId = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const id = request.params[paramName];
    if (!id) {
      throw new BadRequestException('Project id is required');
    }
    if (id.length < 3) {
      throw new BadRequestException(
        'Project id must be at least 3 characters long',
      );
    }
    if (!projectIdRegExp.test(id)) {
      throw new BadRequestException(
        "Project id must only contain letters, numbers, '_', or '-'",
      );
    }
    if (projectIdReservedIds.includes(id)) {
      throw new BadRequestException(
        `Project id cannot be '${id}'. '${id}' is a reserved term.`,
      );
    }
    return id;
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ProjectIdParam() {
  return applyDecorators(
    ApiParam({
      name: 'projectId',
      description: 'Project id',
      type: 'string',
      required: true,
      schema: { 
        minLength: 3,
        pattern: '^[a-zA-Z0-9_-]{3,}$',
      },      
    }),
  );
}
