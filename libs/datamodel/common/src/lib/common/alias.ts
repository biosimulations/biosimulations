// Mostly for documentation purposes. Also allows for all common references to be in one place incase they need more detail later

// Strings with some sort of constraint

// Seconds from epoch
export type DateString = number;
export type Email = string;

// Refers to a string that is a valid id in the BioSimulations database
export type BiosimulationsId = string;
export type ProjectId = BiosimulationsId;
export type ModelId = BiosimulationsId;
export type SimulationId = BiosimulationsId;
export type ChartId = BiosimulationsId;
export type VisualizationId = BiosimulationsId;
export type UserId = BiosimulationsId;
