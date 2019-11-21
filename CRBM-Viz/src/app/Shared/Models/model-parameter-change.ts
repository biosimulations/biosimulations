export class ModelParameterChange {
  id?: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  units?: string;

  constructor (id?: string, name?: string, value?: number, defaultValue?: number, units?: string) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.defaultValue = defaultValue;
    this.units = units;
  }
}
