/**
 * BioSimulations COMBINE service
 * Endpoints for working with COMBINE/OMEX archives and model (e.g., SBML) and simulation (e.g., SED-ML) files that they typically contain.  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SedTask } from './sedTask';
import { SedTarget } from './sedTarget';


/**
 * A SED variable.
 */
export interface SedVariable { 
    /**
     * Unique identifier within its parent SED document.
     */
    id: string;
    /**
     * Brief description.
     */
    name?: string;
    task: SedTask;
    target?: SedTarget;
    /**
     * Symbol (e.g., for an implicit variable that is not explicitly defined in the specification of a model, such as time).
     */
    symbol?: string;
    /**
     * Type.
     */
    _type: SedVariableType;
}
export enum SedVariableType {
    SedVariable = 'SedVariable'
};



