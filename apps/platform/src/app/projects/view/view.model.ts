export interface MetadataValue {
  _type?: 'BioSimulationsMetadataValue';
  label: string | null;
  uri: string | null;
}

export interface CustomMetadata {
  attribute: MetadataValue;
  value: MetadataValue;
}
