// TODO create a dispatch even class to distinguish between response/no response
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

  constructor(
    id: string,
    fileName: string,
    simulator: string,
    version: string,
    cpus: number,
    memory: number,
    maxTime: number,
  ) {
    super(id);
    this.fileName = fileName;
    this.simulator = simulator;
    this.version = version;
    this.cpus = cpus;
    this.memory = memory;
    this.maxTime = maxTime;
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

// TODO remove transpose once all simulators follow row format
export class DispatchFinishedPayload extends DispatchPayload {
  _message = DispatchMessage.finished;

  constructor(id: string, public readonly transpose: boolean) {
    super(id);
  }
}
export class DispatchProcessedPayload extends DispatchPayload {
  _message = DispatchMessage.finished;

  constructor(id: string) {
    super(id);
  }
}
