import { ExtractMetadataJob, JobQueue } from "@biosimulations/messages/messages";
import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor(JobQueue.metadata)
export class metadataProcessor {
    private readonly logger = new Logger(metadataProcessor.name)
    public constructor() { }

    @Process()
    private async extractMetadata(job: Job<ExtractMetadataJob>) {
        
        this.logger.debug(`ectracting metadata for simulation ${job.data.simId}`)
    }

}