export enum MQDispatch {
  SIM_DISPATCH_START = 'sim_dipatch_start',
  SIM_HPC_FINISH = 'sim_hpc_finish',
  SIM_DISPATCH_FINISH = 'sim_dispatch_finish',
  SIM_RESULT_FINISH = 'sim_result_finish',
}

//TODO: Move Queues to generic place with more supporting queues in future
export enum NATSQueues {
  SIM_DISPATCH = 'SIM_DISPATCH'
}
