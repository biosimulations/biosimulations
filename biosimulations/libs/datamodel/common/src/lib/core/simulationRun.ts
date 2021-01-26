export enum SimulationRunStatus {
  // The api has created the entry
  CREATED = 'CREATED',
  // The api has submitted the run and service has accepted
  QUEUED = 'QUEUED',
  // The service has starting the run
  RUNNING = 'RUNNING',
  // The simulation is finished running, and results are being created
  PROCESSING = 'PROCESSING',
  // The run has finished
  SUCCEEDED = 'SUCCEEDED',
  // The run has failed
  FAILED = 'FAILED',
}
