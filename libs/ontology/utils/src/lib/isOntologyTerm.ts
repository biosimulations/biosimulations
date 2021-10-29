import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Ontologies } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';

export function IsOntologyTerm(ontology: Ontologies, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOntologyTerm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [ontology],
      options: validationOptions,
      validator: IsOntologyTermConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isOntologyTerm' })
export class IsOntologyTermConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args?: ValidationArguments): boolean {
    if (value === undefined || !value || typeof value !== 'string') {
      return false;
    }

    const ontology = args?.constraints[0];
    if (!ontology) {
      return false;
    }

    return OntologiesService.isTermId(ontology, value);
  }

  public defaultMessage(args?: ValidationArguments): string {
    return `The value is not an id of a term in the ${args?.constraints[0]} ontology. Information about the available terms is available at https://ontology.api.biosimulations.org/.`;
  }
}
