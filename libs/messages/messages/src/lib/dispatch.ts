import { EnvironmentVariable } from '@biosimulations/datamodel/common';

export enum DispatchMessage {
  // Job created on the database
  created = 'dispatch.created',
  // Job submitted to the HPC
  submitted = 'dispatch.submitted',
  // Job queued by the hpc scheduler
  queued = 'dispatch.queued',
  // Job starting running on the HPC
  started = 'dispatch.started',
  // Job done running
  finished = 'dispatch.finished',
  // Results process
  processed = 'dispatch.processed',
  // Job failed
  failed = 'dispatch.failed',
}

export class Response {
  okay: boolean;
  _message!: DispatchMessage;
  constructor(ok = true) {
    this.okay = ok;
  }
}

export class createdResponse extends Response {
  constructor(ok = true, public description?: string) {
    super(ok);
  }
  _message = DispatchMessage.created;
}

export class DispatchPayload {
  _message!: DispatchMessage;
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export class DispatchCreatedPayload extends DispatchPayload {
  _message: DispatchMessage = DispatchMessage.created;
  fileName: string;
  simulator: string;
  version: string;
  cpus: number;
  memory: number;
  maxTime: number;
  envVars: EnvironmentVariable[];

  constructor(
    id: string,
    fileName: string,
    simulator: string,
    version: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
  ) {
    super(id);
    this.fileName = fileName;
    this.simulator = simulator;
    this.version = version;
    this.cpus = cpus;
    this.memory = memory;
    this.maxTime = maxTime;
    this.envVars = envVars;
  }
}

export class DispatchFailedPayload extends DispatchPayload {
  public _message: DispatchMessage = DispatchMessage.failed;
  public proccessOutput: boolean;
  public constructor(id: string, processOutput = true) {
    super(id);
    this.proccessOutput = processOutput;
  }
}
export class DispatchSubmittedPayload extends DispatchPayload {
  _message = DispatchMessage.submitted;
  constructor(id: string) {
    super(id);
  }
}

export class DispatchFinishedPayload extends DispatchPayload {
  _message = DispatchMessage.finished;

  constructor(id: string) {
    super(id);
  }
}
export class DispatchProcessedPayload extends DispatchPayload {
  _message = DispatchMessage.finished;

  constructor(id: string) {
    super(id);
  }
}
