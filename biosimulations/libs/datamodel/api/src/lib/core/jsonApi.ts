/**
 * Top Level Document
 *
 * A JSON object MUST be at the root of every JSON:API request and response containing data. This object defines a document’s “top level”.
 *
 * A document MUST contain at least one of the following top-level members:
 *
 *  data: the document’s “primary data”
 * errors: an array of error objects
 * meta: a meta object that contains non-standard meta-information.
 * The members data and errors MUST NOT coexist in the same document.
 *
 * A document MAY contain any of these top-level members:
 *
 *  jsonapi: an object describing the server’s implementation
 *   links: a links object related to the primary data.
 *   included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
 *
 * If a document does not contain a top-level data key, the included member MUST NOT be present either.
 */
export interface DataDocument {
  data: PrimaryData;
  meta?: any;
  links?: TopLevelLinks;
  jsonapi?: any;
  error?: never;
}

export interface CompoundDocument extends DataDocument {
  included: ResourceObject[];
}
export interface ErrorDocument {
  error: Error;
  meta?: any;
  links?: TopLevelLinks;
  jsonapi?: any;
  data?: never;
}

export interface MetaDataDocument {
  meta: any;
  data?: PrimaryData;
  links?: TopLevelLinks;
  jsonapi?: any;
}

export interface MetaCompoundDocument extends MetaDataDocument {
  data: PrimaryData;
  included: ResourceObject[];
}

export interface MetaErrorDocument {
  meta: any;
  error?: Error;
  links?: TopLevelLinks;
  jsonapi?: any;
}

export type MetaDocument = MetaDataDocument | MetaErrorDocument;
export type MetaData = any;
/**
 *  The top-level links object MAY contain the following members:
 *
 *  self: the link that generated the current response document.
 *  related: a related resource link when the primary data represents a resource relationship.
 *  pagination links for the primary data.
 *
 */
export interface TopLevelLinks {
  self?: Link;
  related?: Link;
}

export interface PaginatedLinks {
  self?: Link;
  related?: Link;
  first: Link;
  next: Link;
  previous: Link;
  last: Link;
}

/* The document’s “primary data” is a representation of the resource or collection of resources targeted by a request.
 *
 * Primary data MUST be either:
 *
 *  a single resource object, a single resource identifier object, or null, for requests that target single resources
 *  an array of resource objects, an array of resource identifier objects,
 * or an empty array ([]), for requests that target resource collections
 */

export type PrimaryData =
  | null
  | ResourceIdentifier
  | ResourceObject
  | ResourceIdentifier[]
  | ResourceObject[]
  | [];

/** Resource Objects
 *
 * “Resource objects” appear in a JSON:API document to represent resources.
 *
 * A resource object MUST contain at least the following top-level members:
 *
 *  id
 *  type
 *
 * Exception: The id member is not required when the resource object originates at the client
 * and represents a new resource to be created on the server.
 *
 * In addition, a resource object MAY contain any of these top-level members:
 *
 *  attributes: an attributes object representing some of the resource’s data.
 *  relationships: a relationships object describing relationships between the resource and other JSON:API resources.
 *  links: a links object containing links related to the resource.
 *  meta: a meta object containing non-standard meta-information
 *  about a resource that can not be represented as an attribute or relationship.
 */

export interface NewResourceObject {
  /*
    Identification

    Every resource object MUST contain an id member and a type member. The values of the id and type members MUST be strings.

    Within a given API, each resource object’s type and id pair MUST identify a single, unique resource. 
    (The set of URIs controlled by a server, or multiple servers acting as one, constitute an API.)

    The type member is used to describe resource objects that share common attributes and relationships.

    The values of type members MUST adhere to the same constraints as member names.
    */
  id?: string;
  type: string;

  /*
   * Fields
   * A resource object’s attributes and its relationships are collectively called its “fields”.
   * Fields for a resource object MUST share a common namespace with each other
   * and with type and id. In other words, a resource can not have an attribute and relationship with the same name,
   * nor can it have an attribute or relationship named type or id.
   */

  /* Attributes
   *
   * The value of the attributes key MUST be an object (an “attributes object”).
   *  Members of the attributes object (“attributes”) represent information about the resource object in which it’s defined.
   *
   * Attributes may contain any valid JSON value.
   *
   * Complex data structures involving JSON objects and arrays are allowed as attribute values.
   * However, any object that constitutes or is contained in an attribute MUST NOT contain a relationships or links member,
   *  as those members are reserved by this specification for future use.
   *
   * Although has-one foreign keys (e.g. author_id) are often stored internally alongside other information
   * to be represented in a resource object, these keys SHOULD NOT appear as attributes.
   */
  attributes?: any;

  /*
   Relationships
    The value of the relationships key MUST be an object (a “relationships object”). 
    Members of the relationships object (“relationships”) represent references
    From the resource object in which it’s defined to other resource objects.
  */
  relationships?: Relationships;
  links?: any;
  meta?: any;
}
export interface ResourceObject extends NewResourceObject {
  id: string;
}

/*
  A “relationship object” MUST contain at least one of the following:

  links: a links object containing at least one of the following:
      self: a link for the relationship itself (a “relationship link”).
      This link allows the client to directly manipulate the relationship. 
  For example, removing an author through an article’s relationship URL would disconnect the person from the article,
  without deleting the people resource itself. 
  When fetched successfully, this link returns the linkage for the related resources as its primary data. (See Fetching Relationships.)
        related: a related resource link
    data: resource linkage
    meta: a meta object that contains non-standard meta-information about the relationship.

  A relationship object that represents a to-many relationship MAY also contain pagination links under the links member, as described below.
  Any pagination links in a relationship object MUST paginate the relationship data, not the related resources.
*/
export interface Relationships {
  [key: string]: RelationshipObject;
}
export interface RelationshipObject {
  links?: Links;
  data?: ResourceLinkage;
  meta?: any;
}

/*
 Resource Linkage

 Resource linkage in a compound document allows a client to 
 link together all of the included resource objects without having to GET any URLs via links.

Resource linkage MUST be represented as one of the following:
 
    null for empty to-one relationships.
    an empty array ([]) for empty to-many relationships.
    a single resource identifier object for non-empty to-one relationships.
    an array of resource identifier objects for non-empty to-many relationships.

*/

export type ResourceLinkage =
  | null
  | []
  | ResourceIdentifier
  | ResourceIdentifier[];
/* Resource Identifier Objects

A “resource identifier object” is an object that identifies an individual resource.

A “resource identifier object” MUST contain type and id members.

A “resource identifier object” MAY also include a meta member, whose value is a meta object that contains non-standard meta-information.
 */
export interface ResourceIdentifier {
  type: string;
  id: string;
  meta?: any;
}

/* Links

Where specified, a links member can be used to represent links. The value of each links member MUST be an object (a “links object”).

Each member of a links object is a “link”. A link MUST be represented as either:

    a string containing the link’s URL.
    an object (“link object”) which can contain the following members:
        href: a string containing the link’s URL.
        meta: a meta object containing non-standard meta-information about the link.

*/
export interface Links {
  [key: string]: Link;
}
export interface LinkObject {
  href: string;
  meta?: any;
}

type Link = string | LinkObject | null;

/*
 Error Objects

Error objects provide additional information about problems encountered while performing an operation.
 Error objects MUST be returned as an array keyed by errors in the top level of a JSON:API document.

An error object MAY have the following members:

    id: a unique identifier for this particular occurrence of the problem.
    links: a links object containing the following members:
        about: a link that leads to further details about this particular occurrence of the problem.
    status: the HTTP status code applicable to this problem, expressed as a string value.
    code: an application-specific error code, expressed as a string value.
    title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem,
     except for purposes of localization.
    detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
    source: an object containing references to the source of the error, optionally including any of the following members:
        pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, 
        or "/data/attributes/title" for a specific attribute].
        parameter: a string indicating which URI query parameter caused the error.
    meta: a meta object containing non-standard meta-information about the error.

 */
export interface Error {
  id?: string;
  links?: Links;
  about?: Link;
  code?: string;
  title?: string;
  detail?: string;
  source?: { pointer?: string; parameter?: string };
  meta?: any;
}
