export class Simulator {
  name?: string;
  version?: string;
  dockerHubImageId?: string;
    
  constructor (name?: string, version?: string, dockerHubImageId?: string) {
    this.name = name;
    this.version = version;
    this.dockerHubImageId = dockerHubImageId;
  }

  getFullName(): string {
    let fullName:string = this.name;
    if (this.version) {
        fullName += ' ' + this.version;
    }
    return fullName;
  }

  getDockerHubUrl(): string {
    return 'https://hub.docker.com/r/' + this.dockerHubImageId;
  }
}
