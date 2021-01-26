export class SshConnectionConfig {
  constructor(
    public host: string,
    public port: number,
    public username: string,
    public privateKey: string,
  ) {}
}
