import { Controller, Param, Sse, MessageEvent, Logger, Get, Res } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { Response } from 'express';
import { html } from './webpage';

import { interval, map, Observable, take, tap } from 'rxjs';
import { StatusUpdatedEvent } from './simulation-run-events.model';

const sseDescription = `

This endpoint creates a serverside event source that streams the simulation run's status updates. 
The schema for the EventSource is documented below in Json, however the response will be plain text

## Warning
  This endpoint is experimental, and can rapidly change or be removed. It is only recommended for experimental use.


`;

@Controller('simulation-run-events')
@ApiTags('Alpha')
@ApiExtraModels(StatusUpdatedEvent)
export class SimulationRunEventsController {
  private logger = new Logger(SimulationRunEventsController.name);

  @Get()
  public index(@Res() response: Response): void {
    response.type('text/html').send(html);
  }
  @Sse('/:id')
  @ApiOperation({
    description: sseDescription,
    summary: 'Create a Server Sent Event Stream for a simulation run',
  })
  @ApiResponse({
    status: 200,
    description: 'Received event',
    content: {
      'text/event-stream': {
        schema: { $ref: getSchemaPath(StatusUpdatedEvent) },
      },
    },
  })
  public stream(@Param('id') id: string): Observable<MessageEvent> {
    this.logger.log(`Streaming events for simulation run ${id}`);
    return interval(1000).pipe(
      tap((_) => {
        this.logger.log('Sending event');
      }),
      map((_) => ({ type: 'status', data: { hello: 'world' } })),
      take(10),
    );
  }
}
