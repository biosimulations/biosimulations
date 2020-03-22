export class ModelParameter {
  id?: string;
  name?: string;
  value?: number;
  units?: string;

  constructor (id?: string, name?: string, value?: number, units?: string) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.units = units;
  }
}
