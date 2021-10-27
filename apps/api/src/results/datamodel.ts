export class OutputData {
  public id!: string;
  public label!: string;
  public shape!: string;
  public type!: string;
  public name!: string;
  public values!: string[] | number[] | boolean[];
}

export class Output {
  public simId!: string;
  public outputId!: string;
  public name!: string;
  public type!: string;
  public data!: OutputData[];
  public created!: string;
  public updated!: string;
}

export class Results {
  public simId!: string;
  public outputs!: Output[];
  public created!: string;
  public updated!: string;
}
