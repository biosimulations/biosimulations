/**
 * BioSimulations Data Service
 * RESTful application programming interface documentation for the Biosimulations Data Service, based on the HDF Scalable Data Service (HSDS) from the HDF Group.
 *
 * The version of the OpenAPI document: 1.0
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface InlineResponse2012 {
  /**
   * UUID of this Dataset.
   */
  id?: string;
  /**
   * UUID of root Group in Domain.
   */
  root?: string;
  created?: number;
  lastModified?: number;
  attributeCount?: number;
  /**
   * (See `GET /datasets/{id}`)
   */
  type?: object;
  /**
   * (See `GET /datasets/{id}`)
   */
  shape?: object;
}
