import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Ontologies } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';

export function IsOntologyTerm(
  ontology: Ontologies,
  parentTermId?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOntologyTerm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [ontology, parentTermId],
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

    return OntologiesService.isTermId(ontology, value, args?.constraints[1]);
  }

  public defaultMessage(args?: ValidationArguments): string {
    const ontologyId = args?.constraints[0];
    const parentTermId = args?.constraints[1];
    if (parentTermId) {
      return `The value is not an id of a child term of ${parentTermId} in the ${ontologyId} ontology. Information about the terms of the ${ontologyId} ontology is available at https://ontology.api.biosimulations.org/.`;
    } else {
      return `The value is not an id of a term in the ${ontologyId} ontology. Information about the terms of the ${ontologyId} ontology is available at https://ontology.api.biosimulations.org/.`;
    }
  }
}
