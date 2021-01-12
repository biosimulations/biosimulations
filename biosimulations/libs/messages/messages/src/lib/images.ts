export enum ImageMessage {
    refresh = 'refresh'
}

export class ImageMessagePayload {
    simulator: string
    version: string
    url: string
    force: boolean
    constructor(simulator: string, version: string, force = true) {
        {
            this.simulator = simulator
            this.version = version
            this.force = force
            this.url = `docker://ghcr.io/biosimulators/${this.simulator}:${this.version}`
        }
    }
}