export enum DispatchMessage {
  created = 'dispatch.created',
  submitted = 'dispatch.submitted',
  started = 'dispatch.started',
  finsihed = 'dispatch.finished',
  failed = 'dispatch.failed',
}

export class Response {
  okay: boolean;
  _message!: DispatchMessage;
  constructor(ok: boolean = true) {
    this.okay = ok;
  }
}

export class createdResponse extends Response {
  constructor(ok: boolean = true, description?: string) {
    super(ok);
  }
  _message = DispatchMessage.created;
  description?: String;
}
export class DispatchPayload {
  _message!: DispatchMessage;
  simulationId: string;
  constructor(id: string) {
    this.simulationId = id;
  }
}
export class DispatchCreatedPayload extends DispatchPayload {
  _message: DispatchMessage = DispatchMessage.created;
  fileName: string;
  simulator: string;
  version: string;
  constructor(id: string, file: string, simulator: string, version: string) {
    super(id);
    this.fileName = file;
    this.simulator = simulator;
    this.version = version;
  }
}
