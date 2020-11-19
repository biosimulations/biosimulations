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
  description?: string;
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
  file: string;
  simulator: string;
  version: string;
  constructor(id: string, file: string, simulator: string, version: string) {
    super(id);
    this.file = file;
    this.simulator = simulator;
    this.version = version;
  }
}
