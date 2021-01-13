export class HTTPRequestContext {
    method: string
    url: string
    userAgent: string
    referrer: string
    responseStatusCode: number
    remoteIp: string
}
export type SourceLocation = {
    filePath: string
    lineNumber: number
    functionName: string

}
export class ServiceContext {
    service: string
    version?: string
    constructor(service: string, version?: string) {
        this.service = service
        this.version = version
    }
}

export type SourceReference = {
    repository: string
    revisionId: string
}

export class ErrorContext {
    httpRequest: HTTPRequestContext
    user: string
    reportLocation: SourceLocation
    sourceRefrences?: SourceReference[]
}
export class ReportedErrorEvent {
    eventTime!: string
    service: ServiceContext
    message: string
    context: ErrorContext

    constructor(service: ServiceContext, message: string, context: ErrorContext) {
        this.service = service
        this.message = message
        this.context = context
    }
}