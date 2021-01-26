export enum ImageMessage {
  refresh = 'image.refresh',
}

export class ImageMessagePayload {
  _message: ImageMessage = ImageMessage.refresh;
  simulator: string;
  version: string;
  url: string;
  force: boolean;
  constructor(simulator: string, version: string, force = true) {
    {
      this.simulator = simulator;
      this.version = version;
      this.force = force;
      this.url = `docker://ghcr.io/biosimulators/${this.simulator}:${this.version}`;
    }
  }
}

export class ImageMessageResponse {
  _message: ImageMessage = ImageMessage.refresh;
  okay: boolean;
  description: string | undefined;
  constructor(okay: boolean, description?: string) {
    this.okay = okay;
    this.description = description;
  }
}
