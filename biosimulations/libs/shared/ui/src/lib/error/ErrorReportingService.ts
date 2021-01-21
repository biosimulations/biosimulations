import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BiosimulationsError } from "./biosimulations-error";
import { ServiceContext } from "./ErrorReporting";

@Injectable()
export class ErrorReporter {

    // Change this to the name of the app when making a config service
    serviceContext: ServiceContext = new ServiceContext("Frontend")

    public report(error: Error) {
        let message = ""
        if (error instanceof HttpErrorResponse) {
            const underlying = error.error

        } else if (error instanceof BiosimulationsError) {
            message = error.stack || new Error().stack || ""

        } else {
            message = error.stack || new Error().stack || ""

        }




        this.sendError()
    }
    private sendError() {
        throw new Error("Method not implemented.");
    }


}
